import { readdir } from 'fs/promises';
import { basename, join } from 'path';

import Discord from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { CustomClientOptions } from 'src/declarations/typings';
import Database from './Database';
import Command from './Command';

import logger from './Logger';
import { readFiles } from './helpers';

let rest;

// Runs `require` on `path`, wiping `path` from the `require` cache beforehand
// if necessary.
async function reRequire(path: string) {
	delete require.cache[require.resolve(path)];
	const result = await require(path);
	return result;
}

export default class CustomClient extends Discord.Client {
	private interactionsDir: string;

	private commandsDir: string;

	private eventsDir: string;

	private previousEvents: Array<[string, (...a: any) => Promise<void>]>;

	public interactions: Discord.Collection<string, any>;

	public commands: Discord.Collection<string, Command>;

	// Hacky: this is a bit of state that's relied on by `commands/reload.ts`. It
	// can't be stored there, since we do reload that module, which causes us to
	// reset all of its private state.
	public reloadInProgress = false;

	protected commandPaths: Map<string, string>;

	constructor(options: CustomClientOptions) {
		super({
			intents: options.intents,
			partials: options.partials,
			presence: options.presence
		});

		this.interactionsDir = options.interactionsDir;
		this.commandsDir = options.commandsDir;
		this.eventsDir = options.eventsDir;
		this.previousEvents = [];
		this.interactions = new Discord.Collection();
		this.commands = new Discord.Collection();
		this.commandPaths = new Map();
		this.token = options.token;

		rest = new REST({ version: '9' }).setToken(this.token);
	}

	async loadCommands() {
		const files = await readFiles(this.commandsDir).then((list) => list.filter((f) => f.endsWith('.js')));

		// Load commands into temporary Collections so:
		// - comamnds are always fully consistent (internal `await`s break this
		//   function's execution up),
		// - old commands get removed promptly, and
		// - any errors in `import`ing leaves the prior state intact.
		//
		// We have similar logic for interactions/events below.
		const newCommands = new Discord.Collection<string, any>();
		const newCommandPaths = new Discord.Collection<string, string>();
		for (const path of files) {
			const noExtension = path.slice(0, -3);
			const name = basename(noExtension);
			const file = (await reRequire(noExtension)).default as Command;
			let key = '';
			if (file.name) key = file.name;
			if (file.group) key += `-${file.group}`;
			key += key.length ? `-${name}` : name;
			newCommands.set(key, file);
			newCommandPaths.set(key, path);
		}

		this.commands = newCommands;
		this.commandPaths = newCommandPaths;
		logger.info(`Loaded ${this.commands.size} commands.`);

		return this.commands.size;
	}

	async loadInteractions() {
		const commandFiles = (await readdir(this.interactionsDir)).filter((file) => file.endsWith('.js'));

		const newInteractions = new Discord.Collection<string, any>();
		for (const file of commandFiles) {
			const command = (await reRequire(join(this.interactionsDir, file))).default;
			newInteractions.set(command.data.name, command);
		}

		this.interactions = newInteractions;
		logger.info(`Loaded ${this.interactions.size} interactions.`);

		return this.interactions.size;
	}

	async loadEvents() {
		const eventFiles = (await readdir(this.eventsDir)).filter((file) => file.endsWith('.js'));

		const newEvents = [];
		for (const file of eventFiles) {
			const event = (await reRequire(join(this.eventsDir, file))).default;
			const name = file.split('.')[0];
			newEvents.push([name, async (...args) => {
				try {
					await event.call(this, ...args);
				}
				catch (e) {
					logger.error('Error handling event', name, e);
				}
			}]);
		}

		for (const [name, event] of this.previousEvents) {
			this.off(name, event);
		}
		for (const [name, event] of newEvents) {
			this.on(name, event);
		}
		this.previousEvents = newEvents;
		logger.info(`Loaded ${eventFiles.length} events.`);
		return eventFiles.length;
	}

	async saveCommands() {
		const localCommands = this.interactions.map((c) => c.data.toJSON());

		// Used to reload commands faster, since without a specified server, commands may take up to an hour to reflect on Discord
		if (process.env.TEST_GUILD) {
			logger.info('Started refreshing local slash commands.');
			await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD), { body: localCommands });

			// Delete after Testing
			// await rest.put(Routes.applicationGuildCommands(clientID, testGuild), { body: [] });

			logger.info('Successfully reloaded local slash commands.');
		}
		else {
			logger.info('Started refreshing global slash commands.');
			await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: localCommands });
			logger.info('Successfully reloaded global slash commands.');
		}
	}

	async reloadAllCommands() {
		await Promise.all([
			this.loadInteractions(),
			this.loadCommands(),
			this.loadEvents()
		]);

		await this.saveCommands();
	}

	async launch() {
		await Promise.all([
			this.reloadAllCommands(),
			Database.connect()
		]);
		await this.login(this.token);
	}
}
