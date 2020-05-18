import { MessageEmbed } from 'discord.js';
import { Colours } from '../util/constants';

export default class LupiEmbed extends MessageEmbed {
    constructor(data?) {
        super(data);
        this.theme().setTimestamp();
    }

    theme() {
        this.setColor(Colours.Theme);
        return this;
    }

    green() {
        this.setColor(Colours.Green);
        return this;
    }

    red() {
        this.setColor(Colours.Red);
        return this;
    }
}