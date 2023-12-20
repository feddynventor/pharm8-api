import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const newFarmaciaParams = {
    type: "object",
    properties: {
        codice_farmacia: { type: "number" },
        piva: { type: "string", minLength: 11, maxLength: 11 }
    },
    required: ["codice_farmacia","piva"],
} as const;
export type NewFarmaciaParams = FromSchema<typeof newFarmaciaParams>

export const newFarmaciaSchema: FastifySchema = {
    description: "Associa all'utente loggato la farmacia specificata dal codice identificativo ministeriale, associazione come primo gestore e amministratore",
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
    required: [],
} as const;
export type GetFarmaciaParams = FromSchema<typeof getFarmaciaParams>

export const getFarmaciaSchema: FastifySchema = {
    description: "Ottieni farmacia da città o nome. Se non si specifica nulla, ritorna tutte le farmacie della citta dell'utente loggato",
    tags: ["farmacie"],
    security: [{ Bearer: [] }],
    querystring: getFarmaciaParams
}