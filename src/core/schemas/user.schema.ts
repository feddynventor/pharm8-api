import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";

import { userRoles } from "../database/schema";

const newUserParams = {
    type: "object",
    properties: {
        cf: { type: "string", minLength: 16, maxLength: 16 },
        password: { type: "string", minLength: 8 },
        fullname: { type: "string", minLength: 3 },
        role: { enum: userRoles.enumValues }
    },
    required: ["cf","password","fullname","role"],
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
        password: { type: "string", minLength: 8 }
    },
    required: ["cf","password"],
} as const;
export type VerifyUserParams = FromSchema<typeof verifyUserParams>;

export const verifyUserSchema: FastifySchema = {
    description: 'Login e Ritorna token JWT',
    tags: ['login'],
    body: verifyUserParams
}