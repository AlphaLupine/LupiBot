import Client from './lib/structures/LupiClient';
import { CLIENT_OPTIONS } from './lib/util/constants';

const client = new Client(CLIENT_OPTIONS);
client.login().catch(client.console.error);