import { KlasaClient } from "klasa";

export default KlasaClient.defaultClientSchema.add("botModerators", "User", { array: true });