import { LupiCommand } from './LupiCommand';
import { CommandStore, CommandOptions, util, KlasaMessage, Duration } from 'klasa';
import { PermissionLevels } from '../types/Enums';
import { User, GuildMember, GuildMemberManager } from 'discord.js';
import { Moderation } from '../util/constants';
import Modlog, { ModlogUser } from '../managers/Logs';

export interface ModOps extends CommandOptions {
    requiredMember?: boolean;
    optionalDuration?: boolean;
    checkModerable?: boolean;
}

export abstract class ModerationCommand extends LupiCommand {
   
    public requiredMember: boolean;
    public optionalDuration: boolean;
    public checkModerable?: boolean

    protected constructor(
        store: CommandStore,
        file: string[],
        directory: string,
        options: ModOps = {}
    ) {
        super(
            store,
            file,
            directory,
            util.mergeDefault<Partial<ModOps>, ModOps>(
                {
                    flagSupport: true,
                    optionalDuration: false,
                    permissionLevel: PermissionLevels.Moderator,
                    requiredMember: false,
                    runIn: ["text"],
                    usage:
                        options.usage ?? options.optionalDuration
                            ? "<users:...user{,10}> [duration:timespan] [reason:...string]"
                            : "<users:...user{,10}> [reason:...string]",
                    usageDelim: " ",
                    cooldown: 10,
                    cooldownLevel: "guild"
                },
                options
            )
        );

        this.requiredMember = options.requiredMember!;
        this.optionalDuration = options.optionalDuration!;
        this.checkModerable = options.checkModerable!;
        this.customizeResponse("users", (message) =>
            message.language.get(
                this.requiredMember ? "COMMAND_INVALID_MEMBERS" : "COMMAND_INVALID_USERS"
            )
        );
    }

    public async run(message: KlasaMessage, args: Array<unknown>) {
        await this.inhibit(message);

        const resolved = this.resolveOverloads(args);
        const processed = [] as Array<{ log: Moderation.Case; target: ModlogUser }>;
        const errored = [] as Array<{ error: Error; target: ModlogUser }>;

        const { targets, ...raw } = resolved;
        let action: string;

        for (const target of new Set(targets)) {
            try {
                const handled = { ...raw, target } as HandledContext;
                const member = this.checkModerable ? await this.checkModeratable(message, handled) : handled.member
                const memberCache = message.guild!.members
                const log = await this.handle(message, { ...handled, member, memberCache });
                action = Moderation.Actions.get(log.actionIdentfier)!.output;
                processed.push({ log, target });
            } catch (error) {
                errored.push({ error, target });
                console.log(error)
            }
        }

        const output: string[] = [];
        if (processed.length) {
            const users = processed.map(({ target }) => `**${target.tag}**`);
            output.push(
                message.language.get(
                    "COMMAND_MODERATION_SUCCESS",
                    action!,
                    users,
                    raw.duration && this.client.Util.msConversion(raw.duration)!.string
                )
            );
        }

        if (errored.length) {
            const errors = errored.map(({ target, error }) => `**${target.tag}**: ${error}`);
            output.push(message.language.get("COMMAND_MODERATION_FAILURE", errors));
        }

        throw output.join("\n\n");
    }

    protected async createLog(message: KlasaMessage, handled: LogHandledContext) {
        
        return await new Modlog(message.guild!)
            .setType(handled.type)
            .setOffender(handled.target as User)
            .setModerator(message.author)
            .setDuration(handled.duration)
            .setReason(handled.reason)
            .setTimestamp()
            .send();
    }

    public async inhibit(message: KlasaMessage): Promise<unknown> {
        return null;
    }

    public async checkModeratable(message: KlasaMessage, context: HandledContext) {
        /* I'll add default checks for this later */
        const member = await message.guild!.members.fetch(context.target.id).catch(() => {
            if (this.requiredMember) throw message.language.get("USER_NOT_IN_GUILD");
            return null;
        });
        return member;
    }

    protected abstract handle(
        message: KlasaMessage,
        context: HandledContext
    ): Promise<Moderation.Case> | Moderation.Case;

    private resolveOverloads([targets, ...args]: readonly unknown[]): CommandContext {
        if (this.optionalDuration) {
            if (!args[0] && args[1]) {
                // Manage the trailing duration
                const trailingArgs = (args[1] as string).split(/,/g);
                const trailingDuration = trailingArgs[trailingArgs.length - 1];
                const date = new Duration(trailingDuration).offset;
                if (date) {
                    args[0] = date;
                    args[1] = (args[1] as string).slice(0, -(trailingDuration.length + 1)); // + 1 for the comma
                }
            }

            return {
                targets: targets as User[],
                duration: args[0] as number | null,
                reason: args[1] as string | null
            };
        }

        return {
            targets: targets as User[],
            duration: null,
            reason: args[0] as string | null
        };
    }
}

export interface CommandContext {
    targets: User[];
    duration: number | null;
    reason: string | null;
}

export interface HandledContext {
    target: User;
    member?: GuildMember | null;
    memberCache?: GuildMemberManager | null;
    duration: number | null;
    reason: string | null;
}

export interface LogHandledContext extends HandledContext {
    type: Moderation.ActionIdentifiers;
}