import { MessageReaction, User } from 'discord.js';
import { onConnect } from '../structures/helpers';

export default async function onMessageReactionAdd(reaction: MessageReaction, user: User) {
	if (reaction.message.inGuild() && process.env.VERIFY_EMOJI === reaction.emoji.name && !reaction.message.content) {
		if (!reaction.message.author) await reaction.message.fetch();
		await onConnect(reaction.message.author.id, reaction.message.author.tag, user.id, user.tag, reaction.message.guildId, reaction.message.channelId);
	}
}
