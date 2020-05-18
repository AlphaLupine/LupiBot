import { LupiCommand } from '../../lib/structures/LupiCommand';
import { Util } from '../../lib/util/utils';
import { CommandStore, KlasaMessage, util } from 'klasa';
import { Role } from 'discord.js';

export default class Prefix extends LupiCommand {
    public constructor(store:CommandStore, file:string[], directory:string) {
        super(store, file, directory, {
            aliases: [],
            permissionLevel: 2,
            description: (language) => language.get('COMMAND_ADMINISTRATOR_DESC'),
            usage: '<add|remove|show:default> [role{1,3}:role] [...]',
            usageDelim: ' '
        });
    }

    public async run (message:KlasaMessage, [type, ...role]:['add' | 'remove' | 'show', Role]) {
        return this[type](message, role)
    }

    async add(message:KlasaMessage, role:Role[]) {
        if(!role.length) return
        await message.guild!.settings.update('roles.administrator', role, message.guild!, {action: 'add'});
        return message.send(message.language.get('COMMAND_ADMINISTRATOR_ADD_SUCCESS', role.join(', ')));
    }

    async remove(message:KlasaMessage, role:Role[]) {
        if(!role.length) return
        await message.guild!.settings.update('roles.administrator', role, message.guild!, {action: 'remove'});
        return message.send(message.language.get('COMMAND_ADMINISTRATOR_REMOVE_SUCCESS', role.join(', ')));
    }

    async show(message:KlasaMessage) {
        const roles:string[] = await message.guild!.settings.get('roles.administrator')
        if(!roles.length) return message.send(message.language.get('COMMAND_ADMINISTRATOR_FETCH_NONE'));
        let embed = new this.client.Embed().setDescription(
            message.language.get(
                'COMMAND_ADMINISTRATOR_FETCH',
                await Util.roleResolve(roles, message.guild!)
            )
        )
        return message.send(embed);
    }
}