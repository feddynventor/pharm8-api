import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { orderStatus } from "../database/schema";

const newOrdineParams = {
    type: "object",
    properties: {
        aic: { type: "string", minLength: 9 },
        piva: { type: "string", minLength: 11, maxLength: 11 },
        qt: { type: "number", minimum: 1 }
    },
    required: ["aic","piva"],
} as const;
export type NewOrdineParams = FromSchema<typeof newOrdineParams>;

export const newOrdineSchema: FastifySchema = {
    description: '',
    tags: ['ordini'],
    security: [{ Bearer: [] }],
    body: newOrdineParams
}


const getListaOrdiniParams = {
    type: "object",
    properties: {
        status: { type: "string", enum: orderStatus.enumValues }
    },
    required: ["status"]
} as const;
export type GetListaOrdiniParams = FromSchema<typeof getListaOrdiniParams>;

export const getListaOrdiniSchema: FastifySchema = {
    description: '',
    tags: ['ordini','farmacia'],
    security: [{ Bearer: [] }],
    querystring: getListaOrdiniParams
}