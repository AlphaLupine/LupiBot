import { ModerationCommand, HandledContext } from '../../lib/structures/ModerationCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Moderation } from '../../lib/util/constants';

export default class Ban extends ModerationCommand {

	constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
            aliases: ['bannish'],
            permissionLevel: 3,
            requiredMember:false,
            checkModerable: true,
            cooldown: 10,
            requiredPermissions: ['BAN_MEMBERS'],
			description: language => language.get('COMMAND_BAN_DESCRIPTION'),
            usage: '<targets:...user{,10}> [reason:...str]',
            usageDelim: ' '
		});
	}

	async handle(message: KlasaMessage, handled:HandledContext) {
        let days = 0;
        let banFlag = message.flagArgs.days || message.flagArgs.d;
        if(banFlag) {
            days = +Number(banFlag) && Number(banFlag) <= 7 && Number(banFlag) > 0 ? Number(banFlag) : days;
        }
        if(handled.member) await handled.member.ban({ days: days, reason: `${message.author.tag}: ${handled.reason}` });
        return(await this.createLog(message , {
            ...handled,
            type: Moderation.ActionIdentifiers.Ban
        })) as Moderation.Case;
    }
}