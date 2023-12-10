import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

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