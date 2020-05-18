import { Event, EventStore } from "klasa";

export default class extends Event {
    public constructor(store: EventStore, file: string[], directory: string) {
        super(store, file, directory, {
            event: "shardReady",
            once: true
        });
    }

    public async run(id: number) {
        const shardCount = this.client.shard!.count;
        this.client.user!.setActivity(`Shard ${id}`);
        this.client.console.log(`Connected to shard ${id} | ${++id}/${shardCount}`);
    }
}