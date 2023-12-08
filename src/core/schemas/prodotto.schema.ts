import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const searchProdottoParams = {
    type: "object",
    properties: {
        nome: { type: "string", minLength: 3 }  // ricerca avviata con minimi 3 caratteri
    },
    required: ["nome"],
} as const;
export type SearchProdottoParams = FromSchema<typeof searchProdottoParams>;

export const searchProdottoSchema: FastifySchema = {
    description: 'Ricerca prodotto per nome. Minimo 3 caratteri.',
    tags: ['prodotto'],
    security: [{ Bearer: [] }],
    querystring: searchProdottoParams
}


const getProdottoParams = {
    type: 'object',
    properties: {
        aic: { type: 'string' }
    }
} as const;
export type GetProdottoParams = FromSchema<typeof getProdottoParams>;

export const getProdottoSchema: FastifySchema = {
    description: 'Mostra dettagli prodotto',
    tags: ['prodotto'],
    security: [{ Bearer: [] }],
    params: getProdottoParams   // inline param (no querystring)
}