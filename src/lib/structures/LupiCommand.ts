import { Command, CommandStore, KlasaMessage, CommandOptions } from 'klasa';
import { Regex } from '../util/constants';

export abstract class LupiCommand extends Command {

    public formattedUsage:string;

    public constructor(store:CommandStore, file:string[], directory:string, options:CommandOptions,) {
        super(store, file, directory, {
            ...options,
            cooldown:5,
        });
        this.formattedUsage = this.usageString.replace(Regex.formatUsage, "").replace(Regex.minMaxUsage, match => {
            const [min, max] = match.slice(1, -1).split(/,/);
            return `[${min || 1}-${max || "∞"}]`;
        });
    }
    public run(message:KlasaMessage, _params:any[]): any {
        return message;
    }
}