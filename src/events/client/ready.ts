import { Event, EventStore } from 'klasa';

export default class extends Event {
    public constructor(store:EventStore, file:string[], directory:string) {
        super(store, file, directory, {
            name: 'klasaReady',
            once: true
        });
    }

    public async run() {
        const currentShard = this.client.shard!.ids[0];
        const totalShards = this.client.shard!.count;
        if(currentShard === totalShards - 1) {
            this.client.console.log(`Logged in successfully as ${this.client.user!.tag} on ${totalShards} shard(s)!`);
        }

        this.client.setTimeout(() => {
            this.client.tasks.get('disableDebug').run();
        }, +process.env.DEBUG_DISABLE_DELAY! || 300000);
    }
}