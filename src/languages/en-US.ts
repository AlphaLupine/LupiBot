import { Language, LanguageStore } from 'klasa'
import { Emojis } from '../lib/util/constants'
import LanguageHelp from "../lib/managers/LangHelp";

export default class extends Language {

    public constructor(store: LanguageStore, file: string[], directory: string) {
        super(store, file, directory, {
            name: 'en-US',
            enabled: true
        });

        this.language = {
            DEFAULT: (key) => `${key} has not been localized for en-US yet.`,
            DEFAULT_LANGUAGE: 'Default Language',
            SETTING_GATEWAY_EXPECTS_GUILD: 'The parameter <Guild> expects either a Guild or a Guild Object.',
            // ...
            COMMAND_CONF_RESET: (key, response) => `The key **${key}** has been reset to: \`${response}\``,

            COMMAND_OPTION_NOEXTENDEDHELP: `No extended help availible`,
            NONE_SPECIFIED: 'None specified',

            COMMAND_INVALID_USERS: `${Emojis.Fail} Invalid user supplied.`,
            COMMAND_INVALID_MEMBERS: `${Emojis.Fail} Invalid member supplied.`,
            COMMAND_MODERATION_SUCCESS: (action, users, duration) => [
                Emojis.Pass, action, users.join(', '), duration ? `for ${duration}` : ''
            ].filter(Boolean).join(' '),
            COMMAND_MODERATION_FAILURE: (errors) => [
                `${Emojis.Fail} Failed to perform these actions on:`, errors.join('\n')
            ].join('\n'),

            USER_NOT_IN_GUILD: "User is not in this guild",

            COMMAND_LOGS_DESC: 'Display\'s, Add\'s or Remove\'s the logs channel for the guild',
            COMMAND_LOGS_ADD_SUCCESS: (channel) => `${Emojis.Pass} Successfully set ${channel} as a logs channel`,
            COMMAND_LOGS_REMOVE_SUCCESS: `${Emojis.Pass} Successfully reset the logs channel`,
            COMMAND_LOGS_FETCH_NONE: `${Emojis.Fail} This guild has no set logs channel`,
            COMMAND_LOGS_FETCH: (channel) => [`**Assigned logs channel:**`, channel],

            COMMAND_PING_DESC: 'Displays the client\'s current ping, API ping and the average shard ping',
            COMMAND_PING_FETCHING: 'Fetching...',
            COMMAND_PING: (ws, diff, shard) => [
                `**💞 Pulse:** ${ws}ms`,
                `**📬 Message Latency:** ${diff}ms`,
                `**📡 Shard Ping:** ${shard}ms`
            ],

            COMMAND_SHARD_DESC: 'Display\'s information about this guild\'s shard',
            COMMAND_SHARD_COMPLETED: (shardID, shardStatus, shardPing, shardGuildSize) => [
                `**Shard: ${shardID}**`,
                `*Status:* ${shardStatus}`,
                `*Ping:* ${shardPing}`,
                `*Guilds:* ${shardGuildSize}`
            ],

            COMMAND_PREFIX_DESC: 'Display\'s, Add\'s or Remove\'s prefix(es) for the guild',
            COMMAND_PREFIX_ADD_SUCCESS: (prefix) => [`${Emojis.Pass} Successfully added: ${prefix} as prefix(es) for this guild`],
            COMMAND_PREFIX_REMOVE_SUCCESS: (prefix) => [`${Emojis.Pass} Successfully removed: ${prefix} as prefix(es) for this guild`],
            COMMAND_PREFIX_FETCH: (prefix) => [`**Prefixes:**`, prefix],
            COMMAND_PREFIX_FETCH_NONE: `${Emojis.Fail} This guild has no set prefixes, mention me instead!`,
            
            COMMAND_HELP_TITLE: '**Help Menu**',
            COMMAND_HELP_EXTENDED: (usage, description) => [
                `**Command Usage:** \n\`\`${usage}\`\``,
                `\n**Command Description:** \n${description}`
            ],
            COMMAND_HELP_FOOTER: '<> : Required Argument | [] : Optional Argument',
            
            MODLOG_CONTENT: (content) => [
                [
                    `**Staff Member:**`, typeof content.moderator === 'string' ? content.moderator : `${content.moderator.tag} <${content.moderator.id}>`
                ].join(' '),
                `**Offender:** ${content.offender.tag} <${content.offender.id}>`,
                content.timeString ? `**Duration:** ${content.timeString}` : '',
                `**Reason:** ${content.reason}`
            ].filter((x) => x).join('\n'),

            COMMAND_KICK_DESCRIPTION: 'Kicks a member or members from the guild',
            COMMAND_KICK_REASON: (reason) => `${reason ? reason : 'No reason specified'}`,
            COMMAND_KICK_SUCCESS: (targets, reason) => `${Emojis.Pass} Successfully kicked ${targets}, for reason(s): ${reason ? reason : 'No reason specified'}`,
            COMMAND_KICK_FAILURE: (targets) => `${Emojis.Fail} Failed to kick ${targets}`,

            COMMAND_BAN_DESCRIPTION: 'Bans a user or users from the guild',
            COMMAND_BAN_REASON: (reason) => `${reason ? reason : 'No reason specified'}`,
            COMMAND_BAN_SUCCESS: (targets, reason) => `${Emojis.Pass} Successfully banned ${targets}, for reason(s): ${reason ? reason : 'No reason specified'}`,
            COMMAND_BAN_FAILURE: (targets) => `${Emojis.Fail} Failed to ban ${targets}`,

            COMMAND_MODERATOR_DESC: 'Display\'s, Add\'s or Remove\'s moderator roles for the guild',
            COMMAND_MODERATOR_ADD_SUCCESS: (role) => [`${Emojis.Pass} Successfully added: ${role} as a moderator for this guild`],
            COMMAND_MODERATOR_REMOVE_SUCCESS: (role) => [`${Emojis.Pass} Successfully removed: ${role} as a moderator for this guild`],
            COMMAND_MODERATOR_FETCH: (role) => [`**Roles with Moderator permissions:**`, role],
            COMMAND_MODERATOR_FETCH_NONE: `${Emojis.Fail} This guild has no set moderator roles`,

            COMMAND_ADMINISTRATOR_DESC: 'Display\'s, Add\'s or Remove\'s administrator roles for the guild',
            COMMAND_ADMINISTRATOR_ADD_SUCCESS: (role) => [`${Emojis.Pass} Successfully added: ${role} as a administrator for this guild`],
            COMMAND_ADMINISTRATOR_REMOVE_SUCCESS: (role) => [`${Emojis.Pass} Successfully removed: ${role} as a administrator for this guild`],
            COMMAND_ADMINISTRATOR_FETCH: (role) => [`**Roles with Administrator permissions:**`, role],
            COMMAND_ADMINISTRATOR_FETCH_NONE: `${Emojis.Fail} This guild has no set administrator roles`,

            COMMAND_UNBAN_DESCRIPTION: 'Unbans a user or users from the guild',


        };
    }
}