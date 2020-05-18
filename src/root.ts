require('dotenv').config();
import { ShardingManager } from 'discord.js';

process.env.NODE_NO_WARNINGS = "1";

const manager:ShardingManager = new ShardingManager('./dist/index.js', {
    totalShards: +process.env.TOTAL_SHARDS! || 1,
    token: process.env.TOKEN!
});
manager.spawn(manager.totalShards, +process.env.SHARD_SPAWN_DELAY! || 5000).catch(console.error)