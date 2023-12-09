import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const updateGiacenzaParams = {
    type: 'object',
    properties: {
        aic: { type: 'string', minLength: 9, maxLength: 9 }
    },
    required: ['aic'],
} as const;
export type UpdateGiacenzaParams = FromSchema<typeof updateGiacenzaParams>;
const updateGiacenzaQuery = {
    type: 'object',
    properties: {
        differenza: { type: 'number' },
        totale: { type: 'number' }
    },
    required: [],
} as const;
export type UpdateGiacenzaQuery = FromSchema<typeof updateGiacenzaQuery>;

export const updateGiacenzaSchema: FastifySchema = {
    description: "Aggiorna la giacenza del farmaco indicato con la differenza indicata +/- oppure un totale nuovo",
    tags: ['magazzino'],
    security: [{ Bearer: [] }],
    params: updateGiacenzaParams,
    querystring: updateGiacenzaQuery
}


const checkDisponibilitaParams = {
    type: 'object',
    properties: {
        aic: { type: 'string', minLength: 9, maxLength: 9 }
    },
    required: ['aic'],
} as const;
export type CheckDisponibilitaParams = FromSchema<typeof checkDisponibilitaParams>;

export const checkDisponibilitaSchema: FastifySchema = {
    description: "Ritorna tutte le farmacie con disponibilita e relativa quantita",
    tags: ['magazzino'],
    security: [{ Bearer: [] }],
    params: checkDisponibilitaParams
}
