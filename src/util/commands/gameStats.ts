import fetch from "node-fetch";
import "dotenv/config";
import SteamID from "steamid";

interface VanityRequestResponse {
    message: number
    steamId?: string
}

interface VanityRequest {
    response: VanityRequestResponse
}

export enum GameId { // https://wiki.teamfortress.com/wiki/WebAPI#Notes
    "tf2" = 440,
    "csgo" = 730
}

export async function resolveVanityUrl(urlName: string): Promise<string | undefined> {
    const sid = new SteamID(urlName);
    return new Promise(async (resolve) => {
        const sid = new SteamID(urlName);
        if (sid.isValidIndividual()) {
            return Promise.resolve(parseInt(sid.getSteamID64()));
        } else {
            const vanityReq = await fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env["STEAMKEY"]}&vanityurl=${urlName}`);
            const reqJson: any = await vanityReq.json() as VanityRequest;
            return Promise.resolve(reqJson.response.steamId ?? undefined);
        }
    });
}
