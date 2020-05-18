import { ModerationCommand, HandledContext } from '../../lib/structures/ModerationCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Moderation } from '../../lib/util/constants';

export default class Kick extends ModerationCommand {

	constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
            aliases: ['boot'],
            permissionLevel: 3,
            requiredMember:true,
            checkModerable:true,
            cooldown: 10,
            requiredPermissions: ['KICK_MEMBERS'],
			description: language => language.get('COMMAND_KICK_DESCRIPTION'),
            usage: '<targets:...user{,10}> [reason:...str]',
            usageDelim: ' '
		});
	}

	async handle(message: KlasaMessage, handled:HandledContext) {
        if(handled.member) await handled.member.kick(handled.reason!);
        return(await this.createLog(message , {
            ...handled,
            type: Moderation.ActionIdentifiers.Kick
        })) as Moderation.Case;
    }
}