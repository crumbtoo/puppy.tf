import { HighClient, BaseEvent } from "../util/objects.js";
import { BaseEventDataResolvable } from "../util/types.js";
import { glob } from "glob";

export async function eventHandler(highClient: HighClient)
{
    const events = await glob(`src/events/*.ts`);
    const eventArray: Array<BaseEvent> = [];
    
    events.forEach((path: string) => {
        const properPath = `${process.cwd()}/${path}`;
        const base: BaseEvent = new BaseEvent(highClient, `${process.cwd()}/${path}`);
        eventArray.push(base);
        console.log("Event loaded");
    });
    console.log("All events loaded");
};

