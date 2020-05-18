import { LupiCommand } from '../../lib/structures/LupiCommand';
import { CommandStore, KlasaMessage } from 'klasa';

export default class Shard extends LupiCommand {
    public constructor(store:CommandStore, file:string[], directory:string) {
        super(store, file, directory, {
            aliases: [],
            description: (language) => language.get('COMMAND_SHARD_DESC')
        });
    }

    public async run(message:KlasaMessage) {
        const data = "[this.shard.ids[0], this.ws.status, this.ws.ping, this.guilds.cache.size]";
        const shards:number[][] = await this.client.shard!.broadcastEval(data);
        const statusCodes:string[] = ['Ready', 'Connecting', 'Reconnecting', 'Idle', 'Nearly', 'Disconnected', 'Waiting For Guilds', 'Identifying', 'Resuming'];

        let embed = new this.client.Embed().setDescription(
            message.language.get(
                'COMMAND_SHARD_COMPLETED',
                shards[0][0], statusCodes[shards[0][1]], shards[0][2], shards[0][3]
            )
        ).theme()
        return message.send(embed)
    }
}