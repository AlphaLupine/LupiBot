import { LupiCommand } from '../../lib/structures/LupiCommand';
import { CommandStore, KlasaMessage } from 'klasa';

export default class Prefix extends LupiCommand {
    public constructor(store:CommandStore, file:string[], directory:string) {
        super(store, file, directory, {
            aliases: [],
            permissionLevel: 2,
            description: (language) => language.get('COMMAND_PREFIX_DESC'),
            usage: '<add|remove|show:default> [prefix:string] [...]',
            usageDelim: ' '
        });
    }

    public async run (message:KlasaMessage, [type, ...prefix]:['add' | 'remove' | 'show', string]) {
        return this[type](message, prefix)
    }

    async add(message:KlasaMessage, prefix:string[]) {
        if(!prefix.length) return
        console.log(prefix)
        await message.guild!.settings.update('prefix', prefix, {action: 'add'});
        return message.send(message.language.get('COMMAND_PREFIX_ADD_SUCCESS', prefix.join(', ')));
    }

    async remove(message:KlasaMessage, prefix:string[]) {
        if(!prefix.length) return
        await message.guild!.settings.update('prefix', prefix, {action: 'remove'});
        return message.send(message.language.get('COMMAND_PREFIX_REMOVE_SUCCESS', prefix.join(', ')));
    }

    async show(message:KlasaMessage) {
        const prefixes:string[] = await message.guild!.settings.get('prefix');
        if(!prefixes.length) return message.send(message.language.get('COMMAND_PREFIX_FETCH_NONE'));
        let embed = new this.client.Embed().setDescription(
            message.language.get(
                'COMMAND_PREFIX_FETCH',
                prefixes.join('\n')
            )
        )
        return message.send(embed);
    }
}