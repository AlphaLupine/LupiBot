import { Structures } from 'discord.js';
import Queue from '../managers/Queue';

export class LupiGuild extends Structures.get('Guild') {
    public CaseQueue = new Queue();
}

Structures.extend('Guild', () => LupiGuild);