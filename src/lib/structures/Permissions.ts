import { PermissionLevels as PermissionLevel } from 'klasa';
import { PermissionLevels } from '../types/enums';
import { Permissions } from 'discord.js';

export default new PermissionLevel()
.add(PermissionLevels.Everyone, () => true) //0 - Everyone
.add(
    PermissionLevels.Moderator,
    ({ guild, member }) => 
    !!(
        member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) || member?.roles.cache.some((x) => guild?.settings.get('roles.moderator')!.includes(x.id))
    )
) //1 - Moderator
.add(
    PermissionLevels.Administrator,
    ({ guild, member }) =>
    !!(
        member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || member?.roles.cache.some((x) => guild?.settings.get('roles.administrator').includes(x.id))
    )
) // 3 - Admin
.add(PermissionLevels.ManageGuild, ({ member }) => !!member?.permissions.has(Permissions.FLAGS.MANAGE_GUILD), { fetch: true }) // 2 - MANAGE GUILD PERMISSION
.add(PermissionLevels.GuildOwner, ({ member, guild }) => !!(member === guild?.owner), { fetch: true }) // 4
.add(PermissionLevels.Developer, ({ client, author }) => client.owners.has(author));

