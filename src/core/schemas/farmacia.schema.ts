import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const newFarmaciaParams = {
    type: "object",
    properties: {
        nome: { type: "string", minLength: 3 },
        citta: { type: "string", minLength: 2 },
        codice_farmacia: { type: "string", minLength: 11, maxLength: 11 }
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


const signFarmaciaParams = {
    type: "object",
    properties: {
        cf: { type: "string", minLength: 16, maxLength: 16 }
    },
    required: ["cf"],
} as const;
export type SignFarmaciaParams = FromSchema<typeof signFarmaciaParams>

export const signFarmaciaSchema: FastifySchema = {
    description: "Associa l'utente specificato tramite Codice Fiscale alla farmacia che si gestisce [worksIn]",
    tags: ["farmacie"],
    security: [{ Bearer: [] }],
    body: signFarmaciaParams
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