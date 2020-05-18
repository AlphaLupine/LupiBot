import { LupiCommand } from '../../lib/structures/LupiCommand';
import { Command, CommandStore, util, KlasaMessage } from 'klasa';

export default class Help extends LupiCommand {
    public constructor(store:CommandStore, file:string[], directory:string) {
        super(store, file, directory, {
            aliases: ['commands', 'menu'],
            usage: '[core|moderation|setup|show:default] [command:command]',
        });
    }

    async run(message:KlasaMessage, [type, command]:['core'|'configuration'|'moderation'|'show:default', LupiCommand]) {
        if(!command) return this[type](message, command)
        let embed = new this.client.Embed().setDescription(
            message.language.get(
                'COMMAND_HELP_EXTENDED',
                command.usageString ? command.formattedUsage : 'None specified',
                util.isFunction(command.description) ? command.description(message.language) : 'None specified'
             )
         ).setFooter(message.language.get('COMMAND_HELP_FOOTER'))
         return message.send(embed);
    }

    async core(message:KlasaMessage) {
        let commands = this.client.commands.filter(cmd => cmd.category === 'Core');
        let embed = new this.client.Embed().setTitle('Core').setDescription(
            commands.map(cmd => `\`\`${cmd.name}\`\``)
        )
        return message.send(embed);
    }

    async moderation(message:KlasaMessage) {
        let commands = this.client.commands.filter(cmd => cmd.category === 'Moderation');
        let embed = new this.client.Embed().setTitle('Moderation').setDescription(
            commands.map(cmd => `\`\`${cmd.name}\`\``)
        )
        return message.send(embed);
    }

    async setup(message:KlasaMessage) {
        let commands = this.client.commands.filter(cmd => cmd.category === 'Setup');
        let embed = new this.client.Embed().setTitle('Setup').setDescription(
            commands.map(cmd => `\`\`${cmd.name}\`\``)
        )
        return message.send(embed);
    }

    async show(message:KlasaMessage) {
        let categories = [...new Set(this.client.commands.map(cmd => cmd.category))]; categories.sort().splice(1,2)
        let embed = new this.client.Embed().setTitle('Categories:');
        for(const category of categories) {
            embed.addField('\u200B', `\`\`${category}\`\``, true);
        }
        return message.send(embed);
    }
    
}