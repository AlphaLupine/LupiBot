import { LupiCommand } from '../../lib/structures/LupiCommand';
import { CommandStore, KlasaMessage } from 'klasa';

export default class Ping extends LupiCommand {
    public constructor(store:CommandStore, file:string[], directory:string) {
        super(store, file, directory, {
            aliases: ['latency'],
            description: (language) => language.get('COMMAND_PING_DESC')
        });
    }

    public async run(message:KlasaMessage) {
        const pinging = await message.sendLocale('COMMAND_PING_FETCHING');
        const avgShardPing = await this.client.shard!.fetchClientValues('ws.ping').then(
            (res:number[]) => res.reduce((a, b) => a + b) / this.client.shard!.count,
            () => 0 
        );
        const embed = new this.client.Embed().setDescription(
            message.language.get(
                'COMMAND_PING',
                this.client.ws.ping,
                pinging.createdTimestamp - message.createdTimestamp,
                Math.round(avgShardPing)
            )
        )
        return message.send(embed)
    }
}