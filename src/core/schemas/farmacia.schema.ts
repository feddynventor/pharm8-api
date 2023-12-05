import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const newFarmaciaParams = {
    type: "object",
    properties: {
        nome: { type: "string", minLength: 3 },
        citta: { type: "string", minLength: 2 },
    },
    required: ["citta","nome"],
} as const;
export type NewFarmaciaParams = FromSchema<typeof newFarmaciaParams>

export const newFarmaciaSchema: FastifySchema = {
    description: "Registra una nuova farmacia e la associa all'utente loggato",
    tags: ["farmacie","user"],
    security: [{ Bearer: [] }],
    body: newFarmaciaParams
}


const getFarmaciaParams = {
    type: "object",
    properties: {
        nome: { type: "string", minLength: 3 },
        citta: { type: "string", minLength: 2 },
    },
    required: ["citta"],
} as const;
export type GetFarmaciaParams = FromSchema<typeof getFarmaciaParams>

export const getFarmaciaSchema: FastifySchema = {
    description: "Ottieni farmacia da città o nome",
    tags: ["farmacie"],
    security: [{ Bearer: [] }],
    querystring: getFarmaciaParams
}