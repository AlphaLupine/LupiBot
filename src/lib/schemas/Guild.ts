import { KlasaClient } from 'klasa';

export default KlasaClient.defaultGuildSchema
.add('prefix', 'string', { array: true })
.add('channels', (folder) => 
    folder
        .add('modlogs', 'TextChannel')
)
.add('roles', (folder) =>
    folder
        .add('administrator', 'Role', { array: true })
        .add('moderator', 'Role', { array: true })
        .add('mute', 'Role')
)
.add('moderation', (folder) => 
    folder
        .add('defaultReason', 'string', { default: 'No reason specified.' })
        .add('cases', 'any', { array: true })
        .add('mutes', 'string', { array: true })
);