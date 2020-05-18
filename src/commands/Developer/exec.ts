import { LupiCommand } from '../../lib/structures/LupiCommand';
import { CommandStore, KlasaMessage, util, Stopwatch} from 'klasa';
import { Util } from 'discord.js';
import { inspect } from 'util';
import hastebin from 'hastebin.js';

const bin = new hastebin();

export default class Exec extends LupiCommand {
    public constructor(store:CommandStore, file:string[], directory:string) {
        super(store, file, directory, {
            permissionLevel: 5,
            flagSupport:true,
            usage: '<expression:string>',
        });
    }
    public async run(message:KlasaMessage, [expression]:[string]) {
        const format = (code:string): string => [`\`\`\`$ ${code}\`\`\``].join('\n');
        const binFormat = async (code:string) => (code.length > 1000 ? await bin.post(code) : format(code));
        const timer = new Stopwatch();
        const result = await util.exec(expression, { timeout: message.flagArgs.timeout ? +message.flagArgs.timeout : 60000 })
            .catch(stderr => ({ stdout: null, stderr}));
        const execTime = timer.stop().duration.toFixed(5);
        const output = result.stdout ?? '';
        const error = result.stderr ?? '';
        const embed = new this.client.Embed().setTitle('Executed').addField('**Input:**', format(expression)).green();
        if(error) embed.addField('**Error:**', await binFormat(error)).red();
        if(output) embed.addField('**Output:**', await binFormat(output)).addField('**Information:**', `*Time:* ${execTime}ms`);
        return message.send(embed);
    }
}