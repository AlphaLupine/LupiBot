import { KlasaClientOptions } from 'klasa';
import { Guild } from 'discord.js';
import { ModlogUser } from '../managers/Logs';

export const CLIENT_OPTIONS: KlasaClientOptions = {
    owners: JSON.parse(process.env.DEVELOPERS!),
    prefix: [process.env.DEFAULT_PREFIX!],
    noPrefixDM: true,
    typing: true,
    language: 'en-US',
    prefixCaseInsensitive: true,
    providers: { default: 'mongodb', mongodb: { uri: process.env.MONGO_URI } },
    slowmode: 750,
    slowmodeAggressive: true,
    preserveSettings: true,
    schedule: { interval: 5000 },
    disabledCorePieces: ['commands'],
    customPromptDefaults: { quotedStringSupport: true, time: 60000, limit: 1 },
    pieceDefaults: {
        commands: {
            deletable: true,
            quotedStringSupport: true,
            flagSupport: false,
            extendedHelp: ''
        },
        monitors: { ignoreOthers: false }
    },

    console: { utc: true, useColor: true, timestamps: 'HH:mm' },
    consoleEvents: { debug: true, verbose: true, log: false },

    messageSweepInterval: 180,
    messageCacheLifetime: 900,
    messageCacheMaxSize: 300,
    ws: { large_threshold: 1000 },
    partials: ['MESSAGE', 'REACTION'],
    disableMentions: 'everyone',
    fetchAllMembers: false,

    commandEditing: true,
    commandLogging: false,
    commandMessageLifetime: 900,
};

export const enum Colours {
    Theme = '#d765db',
    Green = '#65db65',
    Red = '#fc5151'
}

export const Regex = {
    formatUsage: /:[\w.?]+/gi,
    minMaxUsage: /{.*?.}/g
}

export const enum Emojis {
    Pass = '<:lupiCheckMark:711255443321651230>',
    Fail = '<:lupiCross:711256273542185024>'
}

export namespace Moderation {
    export const enum ActionIdentifiers {
        Warn,
        Kick,
        Softban,
        Mute,
        Unmute,
        Ban,
        Unban
    }

    export interface TypeAssets {
        name: string;
        tempable?: boolean;
        output: string;
    }

    export const Actions = new Map<ActionIdentifiers, TypeAssets>([
        [ActionIdentifiers.Warn, { name: 'Warn', output: 'Warned' }],
        [ActionIdentifiers.Kick, { name: 'Kick', output: 'Kicked' }],
        [ActionIdentifiers.Softban, { name: 'Softban', output: 'Softbanned' }],
        [ActionIdentifiers.Mute, { name: 'Mute', tempable: true, output: 'Muted' }],
        [ActionIdentifiers.Unmute, { name: 'Unmute', output: 'Unmuted' }],
        [ActionIdentifiers.Ban, { name: 'Ban', output: 'Banned' }],
        [ActionIdentifiers.Unban, { name: 'Unban', output: 'Unbanned' }]
    ]);

    export interface Case {
        guild?: Guild;
        type?: string;
        actionIdentfier: ActionIdentifiers;
        caseID: number;
        offender: ModlogUser;
        moderator: ModlogUser | string;
        duration?: number | null;
        timeString?: string | null;
        reason?: string;
        messageID?: string | null;
        timestamp?: number;
    }
}

