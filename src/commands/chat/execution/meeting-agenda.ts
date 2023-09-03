import { Logger } from '@Client';
import { ChatInputCommandInteraction } from 'discord.js';
/*
Meeting{
	id:String
	title:String
	details:text
	createdAt:String
	editedAt:String 
	adgend:String
	time:String
	frequency?:String
	location:String
	attendees:String[]
}
*/

export async function meetingAgenda(interaction: ChatInputCommandInteraction<'cached'>) {
	await interaction;

	// const subcommand = interaction.options.getSubcommand(true);

	// if (subcommand === 'create') {
	Logger.info(interaction);
	// }
}
