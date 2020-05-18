import LupiEmbed from '../structures/LupiEmbed';
import * as Config from '../util/constants';
import { Util as Utils } from '../util/utils';
import Queue from '../managers/Queue';

declare module 'discord.js' {
    interface Client {
        Embed: typeof LupiEmbed;
        Config: typeof Config;
        Util: typeof Utils;
        Queue: Queue;
        prefix: string;
    }

    interface Guild {
        CaseQueue: Queue;
    }

    interface MessageEmbed {
        theme(): this;
        green(): this;
        red(): this;
    }
}