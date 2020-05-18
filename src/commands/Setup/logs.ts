import { LupiCommand } from '../../lib/structures/LupiCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { TextChannel } from 'discord.js';

export default class Logs extends LupiCommand {
    public constructor(store:CommandStore, file:string[], directory:string) {
        super(store, file, directory, {
            aliases: [],
            permissionLevel: 2,
            description: (language) => language.get('COMMAND_LOGS_DESC'),
            usage: '<set|reset|show:default> [channel:channel]',
            usageDelim: ' '
        });
    }

    public async run (message:KlasaMessage, [type, channel]: ["set" | "reset" | "show", TextChannel]) {
        return this[type](message, channel)
    }
   
    async set(message:KlasaMessage, channel:TextChannel) {
        if(!channel) return
        await message.guildSettings!.update('channels.modlogs', channel);
        return message.send(message.language.get('COMMAND_LOGS_ADD_SUCCESS', channel));
    }

    async remove(message:KlasaMessage) {
        await message.guild!.settings.reset('channels.modlogs');
        return message.send(message.language.get('COMMAND_LOGS_REMOVE_SUCCESS'));
    }

    async show(message:KlasaMessage) {
        const logs = await message.guild!.settings.get('channels.modlogs');
        if(!logs) return message.send(message.language.get('COMMAND_LOGS_FETCH_NONE'));
        let embed = new this.client.Embed().setDescription(
            message.language.get(
                'COMMAND_LOGS_FETCH',
                message.guild!.channels.cache.get(logs)
            )
        )
        return message.send(embed);
    }
}