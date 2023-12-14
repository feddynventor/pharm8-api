import { UserPayload } from "../../core/entities/user";
import { IUserRepository } from "../../core/interfaces/user.iface";

import { db } from "../../core/database/connect";
import { farmacie, users } from "../../core/database/schema";

import { eq } from "drizzle-orm";
import { generate, verify } from "password-hash";
import { NewUserParams, UpdateUserParams, VerifyUserParams } from "../../core/schemas/user.schema";

export class UserRepository implements IUserRepository {
    async createUser(u: NewUserParams): Promise<string> {
        return db
        .insert(users)
        .values({
            cf: u.cf,
            password: generate(u.password),
            fullname: u.fullname,
            firebase: u.firebase_token,
            citta: u.citta
        })
        .returning({
            insertedId: users.uuid
        })
        .then(res => {
            return res[0].insertedId
        })
    }

    async getUser(user_id: string): Promise<UserPayload> {
        // si conosce uuid da token jwt
        return db.query.users.findFirst({
            with: {
                favourite: true,
                worksIn: true
            },
            columns: {
                password: false
            },
            where: eq(users.uuid, user_id)
        }).then()
    }

    async deleteUser(user_id: string): Promise<void> {
        return db
        .delete(users)
        .where(eq(users.uuid, user_id))
        .then()
    }

    async verifyUser(u: VerifyUserParams): Promise<string> {
        // si conosce cf e password, l'oggetto utente viene usato per calcolare il token jwt
        return db
        .select()
        .from(users).where( eq(users.cf, u.cf) )
        .then( res => {
            if (res.length == 0) throw new Error("Utente inesistente")
            if ( verify(u.password, res[0].password) ){ //hash check
                return res
            } else
                throw new Error("Password errata")
        })
        .then( res => {
            if (res[0].firebase != u.firebase_token)
                return db
                .update(users)
                .set({
                    firebase: u.firebase_token
                })
                .where(eq(users.cf, u.cf))
                .then( () => res )
            
            return res
        })
        .then( res => {
            if (res[0].uuid) return res[0].uuid
            else throw new Error("Utente inesistente")
        })
        .then( this.getUser )
        .then( user => {
            return user.uuid
        })
    }

    async updateFarmaciaPreferita(user_id: string, piva: string): Promise<void> {
        return db
        .select({uuid: farmacie.uuid})
        .from(farmacie)
        .where(eq(farmacie.piva, piva))
        .then(async (res) => {
            if (res.length==0) throw new Error("Farmacia non trovata")
            else {
                return db
                .update(users)
                .set({
                    favourite: res[0].uuid
                })
                .where(eq(users.uuid, user_id))
                .then()
            }
        })
    }
    async updateCitta(user_id: string, citta: string): Promise<void> {
        return db
        .update(users)
        .set({
            citta: citta
        })
        .where(eq(users.uuid, user_id))
        .then()
    }
}