import { LupiCommand } from '../../lib/structures/LupiCommand';
import { CommandStore, KlasaMessage, util, Stopwatch } from 'klasa';
import { Util } from 'discord.js';
import { inspect } from 'util';
import hastebin from 'hastebin.js';
const bin = new hastebin();

export default class Eval extends LupiCommand {
    public constructor(store:CommandStore, file:string[], directory:string) {
        super(store, file, directory, {
            permissionLevel: 5,
            usage: '<expression:string>',
            flagSupport: true
        });
    }
    public async run(message:KlasaMessage, [expression]) {
        const depth = +message.flagArgs.depth || 0;
        const async = message.flagArgs["no-async"] ? false : message.flagArgs.async;
        const format = (code: string): string => ['```ts', code, '```'].join('\n');
        let toEval = Util.escapeCodeBlock(expression.replace(/\n/g, ''));
        const embed = new this.client.Embed().addField('**Input:**', format(toEval));
        let error:string;

        if (async) toEval = `(async () => { return ${toEval} })()`;
        try {
            const stopWatch = new Stopwatch();
            const evaluated = await eval(toEval)
            const difference = stopWatch.stop().duration.toFixed(5);
            const type = util.toTitleCase(typeof evaluated);
            let output = inspect(evaluated, { depth });
            output = output.length < 1000 ? format(output) : await bin.post(output);
            embed.green().addField('**Output:**', output.replace(this.client.token!, "0_0")).addField('**Information:**', [`**Type:** ${type}`, `**Time:** ${difference}ms`].join('\n'));
        } catch (err) {
            const full = err.stack ?? err;
            error = full.length < 1000 ? format(full) : await bin.post(full);
            embed.red().addField('**Error:**', error);
        }
        if('silent' in message.flagArgs) return null;
        return message.send(embed);
    }
}