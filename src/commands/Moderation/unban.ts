import { ModerationCommand, HandledContext } from '../../lib/structures/ModerationCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Moderation } from '../../lib/util/constants';

export default class Unban extends ModerationCommand {

	constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
            aliases: [],
            permissionLevel: 3,
            requiredMember:true,
            checkModerable: false,
            cooldown: 10,
            requiredPermissions: ['BAN_MEMBERS'],
			description: language => language.get('COMMAND_UNBAN_DESCRIPTION'),
            usage: '<targets:...user{,10}> [reason:...str]',
            usageDelim: ' '
		});
	}

	async handle(message: KlasaMessage, handled:HandledContext) {
        if(handled.member) await handled.memberCache?.unban(handled.member, handled.reason!)
        return(await this.createLog(message , {
            ...handled,
            type: Moderation.ActionIdentifiers.Unban
        })) as Moderation.Case;
    }
}