import { PrismaClient } from "@prisma/client";
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
