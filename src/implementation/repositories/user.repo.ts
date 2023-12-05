import { Role, UserTokenVerification } from "../../core/entities/user";
import { IUserRepository } from "../../core/interfaces/user.iface";

import { db } from "../../core/database/connect";
import { users, userRoles } from "../../core/database/schema";

import { eq } from "drizzle-orm";
import { generate, verify } from "password-hash";
import { NewUserParams, VerifyUserParams } from "../../core/schemas/user.schema";

export class UserRepository implements IUserRepository {
    async createUser(u: NewUserParams): Promise<string> {
        return db
        .insert(users)
        .values({
            cf: u.cf,
            password: generate(u.password),
            fullname: u.fullname,
            role: userRoles.enumValues[u.role]
        })
        .returning({
            insertedId: users.uuid
        })
        .then(res => {
            return res[0].insertedId
        })
        .catch(err => {
            throw new Error(err)
        })
    }

    async verifyUser(u: VerifyUserParams): Promise<UserTokenVerification> {
        return db
        .select()
        .from(users).where(eq(users.cf, u.cf))
        .then(res => {
            if (res.length == 0) throw new Error("Utente inesistente")
            if ( verify(u.password, res[0].password) ){
                const { 
                    password, // private data
                    role,     // enums
                    ...rest
                } = res[0];
                return {
                    role: Object.values(Role)[role],    //enums
                    ...rest
                } as UserTokenVerification
            } else
                throw new Error("Password errata")
        })
        .catch(err => {
            throw new Error(err)
        })
    }
}