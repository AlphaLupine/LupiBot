import { Guild, Client, User, TextChannel, Permissions } from "discord.js";
import { LupiGuild } from '../extensions/LupiGuild';
import { Moderation } from "../util/constants";
import { Duration } from "klasa";
const PermissionField = new Permissions(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS"]);

export default class Modlog {
    public guild: LupiGuild;
    public client: Client;

    public actionIdentifer!: Moderation.ActionIdentifiers;

    public type!: string;
    public caseID!: number;
    public offender!: ModlogUser;
    public moderator!: ModlogUser | string;
    public duration!: number | null;
    public reason!: string;
    public messageID!: string | null;
    public timestamp!: number;

    constructor(guild: LupiGuild, modlog?: Moderation.Case) {
        this.guild = guild;
        this.client = guild.client;
        this.reason = this.defaultReason;

        if (modlog) this.setCase(modlog);
        else this.setTimestamp();
    }

    public get nextCaseID() {
        this.caseID = this.guild.settings.get("moderation.cases").length + 1;
        return this.caseID;
    }

    public get defaultReason() {
        this.reason = this.guild.settings.get("moderation.defaultReason");
        return this.reason;
    }

    public get channel() {
        const channel = this.guild.settings.get("channels.modlogs");
        return this.guild.channels.cache.get(channel) as TextChannel;
    }

    public get embed() {
        return new this.client.Embed()
            .setTitle(`[ID: ${this.caseID}] ${this.type}`)
            .setDescription(this.guild.language.get("MODLOG_CONTENT", this.info))
            .red();
    }

    public get info(): Moderation.Case {
        return {
            guild: this.guild,
            type: this.type,
            actionIdentfier: this.actionIdentifer,
            caseID: this.caseID,
            offender: this.offender,
            moderator: this.moderator,
            duration: this.duration,
            timeString: this.client.Util.msConversion(this.duration)?.string,
            reason: this.reason,
            messageID: this.messageID,
            timestamp: this.timestamp || new Date().getTime()
        };
    }

    public get dbCase(): Moderation.Case {
        return {
            actionIdentfier: this.actionIdentifer,
            caseID: this.caseID,
            offender: this.offender,
            moderator: this.moderator,
            duration: this.duration,
            reason: this.reason,
            messageID: this.messageID,
            timestamp: this.timestamp || new Date().getTime()
        };
    }

    public setCase(_case: Moderation.Case) {
        Object.assign(this, _case);
        return this;
    }

    public setType(type: Moderation.ActionIdentifiers) {
        this.type = Moderation.Actions.get(type)!.name;
        this.actionIdentifer = type;
        return this;
    }

    public setOffender(user: ModlogUser | User) {
        this.offender = { id: user.id, tag: user.tag };
        return this;
    }

    public setModerator(user: ModlogUser | User | string) {
        this.moderator = typeof user === "string" ? user : { id: user.id, tag: user.tag };
        return this;
    }

    public setDuration(value: string | number | null) {
        const identifer = Moderation.Actions.get(this.actionIdentifer);
        if (identifer && identifer.tempable) {
            if (typeof value === "string") value = new Duration(value.trim()).offset;

            this.duration = value && +value ? value : null;
        } else {
            this.duration = null;
        }
        return this;
    }

    public setReason(reason: string | string[] | null) {
        if (!reason) return this;
        this.reason = typeof reason === "string" ? reason : reason.join(" ");
        return this;
    }

    public setTimestamp(time?: number) {
        this.timestamp = time ?? new Date().getTime();
        return this;
    }

    protected async save(edit?: boolean) {
        let modlogs = this.guild.settings.get("moderation.cases") as Array<Moderation.Case>;
        if (edit) modlogs = modlogs.filter((x) => x.caseID !== this.caseID);
        modlogs.push(this.dbCase);
        await this.guild.settings.update("moderation.cases", modlogs, {
            action: "overwrite",
            force: true
        });
        return this.info;
    }

    public async send() {
        this.guild.CaseQueue.add(async () => {
            this.caseID = this.nextCaseID;
            const channel = this.channel;
            if (channel && channel.permissionsFor(this.guild.me!)?.has(PermissionField, true)) {
                const sentLog = await channel.send(this.embed).catch(() => null);
                this.messageID = sentLog && sentLog.id;
            }

            return await this.save();
        });

        return this.info;
    }

    public async edit() {
        const channel = this.channel;
        if (!channel) return;

        try {
            const message = await channel.messages.fetch(this.messageID as string);
            await message.edit(this.embed);
        } catch {
            /* Do nothing */
        }
    }
}
export interface ModlogUser {
    id: string;
    tag: string;
}
