import { ChatInputCommand } from '@Client';
import { meetingAgenda } from '@execution/meeting-agenda';
import { localization, t } from '@i18n';

export const ns = 'meeting-agenda';

export default new ChatInputCommand()
	.setBuilder((builder) =>
		builder
			.setName(t({ key: 'command-name', ns }))
			.setDescription(t({ key: 'command-description', ns }))
			.setNameLocalizations(localization('command-name', ns))
			.setDescriptionLocalizations(localization('command-decription', ns))
			// .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
			.addSubcommand((subcommand) =>
				subcommand
					.setName(t({ key: 'create', ns }))
					.setDescription(t({ key: 'create-description', ns }))
					.setNameLocalizations(localization('create', ns))
					.setDescriptionLocalizations(localization('create-description', ns))
					.addStringOption((option) =>
						option
							.setName(t({ key: 'title', ns }))
							.setDescription(t({ key: 'title-descrption', ns }))
							.setNameLocalizations(localization('title', ns))
							.setDescriptionLocalizations(localization('title-description', ns))
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName(t({ key: 'time', ns }))
							.setDescription(t({ key: 'time-description', ns }))
							.setNameLocalizations(localization('time', ns))
							.setDescriptionLocalizations(localization('time-description', ns))
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName(t({ key: 'frequency', ns }))
							.setDescription(t({ key: 'frequency-description', ns }))
							.setNameLocalizations(localization('frequency', ns))
							.setDescriptionLocalizations(localization('frequency-description', ns))
							.setRequired(false)
					)
					.addStringOption((option) =>
						option
							.setName(t({ key: 'agenda', ns }))
							.setDescription(t({ key: 'agenda-description', ns }))
							.setNameLocalizations(localization('agenda', ns))
							.setDescriptionLocalizations(localization('agenda-description', ns))
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName(t({ key: 'details', ns }))
							.setDescription(t({ key: 'details-description', ns }))
							.setNameLocalizations(localization('details', ns))
							.setDescriptionLocalizations(localization('details-description', ns))
							.setRequired(false)
					)
					.addStringOption((option) =>
						option
							.setName(t({ key: 'location', ns }))
							.setDescription(t({ key: 'loction-description', ns }))
							.setNameLocalizations(localization('loction', ns))
							.setDescriptionLocalizations(localization('location-description', ns))
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName(t({ key: 'add-member', ns }))
					.setDescription(t({ key: 'add-member-description', ns }))
					.setNameLocalizations(localization('add-member', ns))
					.setDescriptionLocalizations(localization('add-member-description', ns))
					.addUserOption((option) =>
						option
							.setName(t({ key: 'attendee', ns }))
							.setDescription(t({ key: 'attendee-description', ns }))
							.setNameLocalizations(localization('attendee', ns))
							.setDescriptionLocalizations(localization('attendee-description', ns))
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName(t({ key: 'meeting-id', ns }))
							.setDescription(t({ key: 'meeting-id-description', ns }))
							.setNameLocalizations(localization('meeting-id', ns))
							.setDescriptionLocalizations(localization('meeting-id-description', ns))
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName(t({ key: 'promote-member', ns }))
					.setDescription(t({ key: 'promote-member-description', ns }))
					.setNameLocalizations(localization('promote-member', ns))
					.setDescriptionLocalizations(localization('promote-member-description', ns))
					.addStringOption((option) =>
						option
							.setName(t({ key: 'role', ns }))
							.setDescription(t({ key: 'role-description', ns }))
							.setNameLocalizations(localization('role', ns))
							.setDescriptionLocalizations(localization('role-description', ns))
							.setRequired(true)
					)
					.addUserOption((option) =>
						option
							.setName(t({ key: 'member', ns }))
							.setDescription(t({ key: 'member-description', ns }))
							.setNameLocalizations(localization('member', ns))
							.setDescriptionLocalizations(localization('member-description', ns))
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName(t({ key: 'meeting-id', ns }))
							.setDescription(t({ key: 'meeting-id-description', ns }))
							.setNameLocalizations(localization('meeting-id', ns))
							.setDescriptionLocalizations(localization('meeting-id-description', ns))
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName(t({ key: 'reminder', ns }))
					.setDescription(t({ key: 'reminder-description', ns }))
					.setNameLocalizations(localization('reminder', ns))
					.setDescriptionLocalizations(localization('reminder-description', ns))
					.addStringOption((option) =>
						option
							.setName(t({ key: 'set-reminder', ns }))
							.setDescription(t({ key: 'set-reminder-description', ns }))
							.setNameLocalizations(localization('set-reminder', ns))
							.setDescriptionLocalizations(localization('set-reminder', ns))
							.setRequired(true)
					)
					.addStringOption((option) =>
						option
							.setName(t({ key: 'meeting-id', ns }))
							.setDescription(t({ key: 'meeting-id-description', ns }))
							.setNameLocalizations(localization('meeting-id', ns))
							.setDescriptionLocalizations(localization('meeting-id-description', ns))
							.setRequired(true)
					)
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName(t({ key: 'agenda-clear' }))
					.setDescription(t({ key: 'agenda-clear-description', ns }))
					.setNameLocalizations(localization('adgenda-clear', ns))
					.setDescriptionLocalizations(localization('adgend-clear-description', ns))
					.addStringOption((option) =>
						option
							.setName(t({ key: 'meeting-id', ns }))
							.setDescription(t({ key: 'meeting-id-description', ns }))
							.setNameLocalizations(localization('meeting-id', ns))
							.setDescriptionLocalizations(localization('meeting-id-description', ns))
							.setRequired(true)
					)
			)
	)
	.setGlobal(true)
	.setExecute(meetingAgenda);
