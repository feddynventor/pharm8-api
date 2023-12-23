import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const newFarmaciaParams = {
    type: "object",
    properties: {
        nome: { type: "string", minLength: 3 },
        citta: { type: "string", minLength: 2 },
        codice_farmacia: { type: "string", minLength: 5, maxLength: 5 }
    },
    required: ["citta","nome","codice_farmacia"],
} as const;
export type NewFarmaciaParams = FromSchema<typeof newFarmaciaParams>

export const newFarmaciaSchema: FastifySchema = {
    description: "Registra una nuova farmacia e la associa all'utente loggato, come primo gestore e amministratore",
    tags: ["farmacie"],
    security: [{ Bearer: [] }],
    body: newFarmaciaParams
}

const getFarmaciaParams = {
    type: "object",
    properties: {
        nome: { type: "string", minLength: 3 },
        citta: { type: "string", minLength: 2 },
    },
    required: [],
} as const;
export type GetFarmaciaParams = FromSchema<typeof getFarmaciaParams>

export const getFarmaciaSchema: FastifySchema = {
    description: "Ottieni farmacia da città o nome. Se non si specifica nulla, ritorna tutte le farmacie della citta dell'utente loggato",
    tags: ["farmacie"],
    security: [{ Bearer: [] }],
    querystring: getFarmaciaParams
}