import { KlasaClient, KlasaClientOptions } from 'klasa';
import * as Config from '../util/constants';
import { Util } from '../util/utils';
import Queue from '../managers/Queue';

import permissionLevels from './Permissions'
import LupiEmbed from './LupiEmbed';
import Guild from '../schemas/Guild';

import '../extensions/LupiGuild';

export default class LupiClient extends KlasaClient {
    public Embed = LupiEmbed;
    public Config = Config;
    public Util = Util
    public Queue = new Queue;
    public prefix = process.env.DEFAULT_PREFIX!;

    public constructor(options: KlasaClientOptions = {}){
        super({
            ...options,
            permissionLevels,
            gateways: {
                guilds: { schema: Guild }
            }
        });
    }
}