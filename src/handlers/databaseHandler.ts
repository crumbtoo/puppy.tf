import { PrismaClient } from "@prisma/client";
import { singleton } from "tsyringe";

@singleton()
export class DatabaseHandler
{
    get pClient(): PrismaClient {
        return this._pClient;
    }

    private _pClient: PrismaClient;

    constructor() {
        const prisma = new PrismaClient();

        this._pClient = prisma;
    }

}
