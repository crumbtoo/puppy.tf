import SteamUser from "steam-user";
import GlobalOffensive from "globaloffensive";
import fetch from "node-fetch";
import "dotenv/config";
import { Readable } from "stream";
import { DemoFile } from "demofile";
import bz2 from "unbzip2-stream";

export class SteamHandler {
  private steamClient: SteamUser;
  private csgoClient: GlobalOffensive;

  constructor () {
    this.steamClient = new SteamUser();
    this.csgoClient = new GlobalOffensive(this.steamClient);
  }

  async run() {
    const steamClient = this.steamClient;
    const csgoClient = this.csgoClient;

    steamClient.logOn({
      accountName: process.env["STEAMACC"],
      password: process.env["STEAMPASS"],
      twoFactorCode: "3CQP4",
    });

    steamClient.on("error", (e) => {
      // Some error occurred during logon
      console.log(e);
    });

    steamClient.on("loggedOn", () => {
      if (steamClient && steamClient.steamID) {
        console.log(
          "Logged into Steam as " + steamClient.steamID.getSteam3RenderedID()
        );
        steamClient.gamesPlayed([730]);
        csgoClient.requestGame("CSGO-ntMuy-wjKUn-vOVrh-vsiMP-Ac9eD");
      }
    });

    csgoClient.on("connectedToGC", () => {
      csgoClient.requestGame("CSGO-ntMuy-wjKUn-vOVrh-vsiMP-Ac9eD");
    });

    csgoClient.on("matchList", async (match: Array<GlobalOffensive.Match>) => {
      const matchFirst = match[0];
      console.log(matchFirst);
      const lastRes = matchFirst.roundstatsall.length - 1;
      const demoURL: any = matchFirst.roundstatsall[lastRes].map;

      const fetchedResponse = await fetch(demoURL);
      const stream = fetchedResponse;
      if (stream.body) {
        const demoFile = new DemoFile();

        demoFile.userMessages.on("ServerRankUpdate", (um) => {
            console.log("Player rank updates:");
            for (const update of um.rankUpdate) {
                const player = demoFile.entities.getByAccountId(update.accountId);
                if (!player) console.log(`> (unknown player ${update.accountId})`);
                else
                console.log(`> ${player.name}: ${update.rankOld} -> ${update.rankNew}`);
            }
        });
        
        demoFile.on("end", (e) => {
            if (e.error) {
                console.error("Error during parsing:", e.error);
                process.exitCode = 1;
            }
        
            console.log("Finished.");
        });
        
        demoFile.parseStream(new Readable().wrap(stream.body.pipe(bz2())));
      }
    });
  }
}