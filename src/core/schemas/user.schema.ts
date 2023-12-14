import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

const newUserParams = {
    type: "object",
    properties: {
        cf: { type: "string", minLength: 16, maxLength: 16 },
        password: { type: "string", minLength: 8 },
        fullname: { type: "string", minLength: 3 },
        citta: { type: "string" },
        firebase_token: { type: "string" }
    },
    required: ["cf","password","fullname"],
} as const;
export type NewUserParams = FromSchema<typeof newUserParams>

export const newUserSchema: FastifySchema = {
    description: 'Aggiungi nuovo utente',
    tags: ['login'],
    body: newUserParams
}

const verifyUserParams = {
    type: "object",
    properties: {
        cf: { type: "string", minLength: 16, maxLength: 16 },
        password: { type: "string", minLength: 8 },
        firebase_token: { type: "string" }
    },
    required: ["cf","password"],
} as const;
export type VerifyUserParams = FromSchema<typeof verifyUserParams>;

export const verifyUserSchema: FastifySchema = {
    description: 'Login e Ritorna token JWT',
    tags: ['login'],
    body: verifyUserParams
}

const updateUserParams = {
    type: "object",
    properties: {
        farmacia_preferita: { type: "string", minLength: 11, maxLength: 11 },
        citta: { type: "string" }
    },
    required: [],
} as const;
export type UpdateUserParams = FromSchema<typeof updateUserParams>;

export const UpdateUserSchema: FastifySchema = {
    description: `Aggiorna dati utente:
        Farmacia preferita con il codice farmacia corrispondente`,
    tags: ['user'],
    security: [{ Bearer: [] }],
    body: updateUserParams
}