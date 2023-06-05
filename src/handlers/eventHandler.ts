import { HighClient, BaseEvent } from "../util/objects.js";
import { dirname, importx } from "@discordx/importer";
import { BaseEventDataResolvable } from "../util/types.js";
import { glob } from "glob";

export async function eventHandler(highClient: HighClient)
{
    const data = await importx(`${dirname(import.meta.url)}/../events/**/*.{js,ts}`);
    return;
 /*   const events = await glob(`src/events/*.ts`);
    const eventArray: Array<BaseEvent> = [];
    
    events.forEach((path: string) => {
        const properPath = `${process.cwd()}/${path}`;
        const base: BaseEvent = new BaseEvent(highClient, `${process.cwd()}/${path}`);
        eventArray.push(base);
        console.log("Event loaded");
    });
    console.log("All events loaded");
    */
};

