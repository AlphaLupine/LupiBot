import { Role, Guild } from "discord.js";

export class Util {
    static msConversion = (ms?: number | null) => {
        if(!ms) return null;

        const rounded = ms > 0 ? Math.floor : Math.ceil;
        const times = {
            days: rounded(ms / 86400000),
            hours: rounded(ms / 3600000) % 24,
            minutes: rounded(ms / 60000) % 60,
            seconds: rounded(ms / 1000) % 60,
            milliseconds: rounded(ms) % 1000
        };
        const grammarCorrection = (x) => (x !== 1 ? 's' : '');
        const string = [
            +times.days ? `${times.days} day${grammarCorrection(times.days)}` : "",
            +times.hours ? `${times.hours} hour${grammarCorrection(times.hours)}` : "",
            +times.minutes ? `${times.minutes} minute${grammarCorrection(times.minutes)}` : "",
            +times.seconds ? `${times.seconds} second${grammarCorrection(times.seconds)}` : ""
        ]
            .filter((x) => x).join(', ');
        return { ...times, string };
    };

    static roleResolve = async (roles:string[], guild:Guild) => {
        let resolvedRoles:Role[] = []
        for(const toResolve of roles) {
            let resolved = await guild!.roles.fetch(toResolve)
            resolvedRoles.push(resolved!)
        }
        return resolvedRoles;
    }
}