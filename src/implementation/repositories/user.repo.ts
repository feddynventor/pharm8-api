import { User, UserPayload } from "../../core/entities/user";
import { IUserRepository } from "../../core/interfaces/user.iface";

import { db } from "../../core/database/connect";
import { farmacie, users } from "../../core/database/schema";

import { eq } from "drizzle-orm";
import { generate, verify } from "password-hash";
import { NewUserParams, UpdateUserParams, VerifyUserParams } from "../../core/schemas/user.schema";
import { Farmacia, FarmaciaPayload } from "../../core/entities/farmacia";

const getUserObject = async (res: any): Promise<UserPayload> => {
    if (res.length==0) throw new Error("No user found")
    const {
        firebase,
        password,   // dati privati
        favourite,  // extracted uuids
        worksIn,
        ...rest
    } = res[0];

    let userObj: UserPayload = new User();

    if (favourite){
        await db.select().from(farmacie)
        .where(eq(farmacie.uuid, favourite))
        .then(res => {
            userObj.favourite = new Farmacia(res[0] as Omit<FarmaciaPayload, 'uuid'>)
        })
        .catch(err => {
            userObj.favourite = undefined
        })
    }
    if (worksIn){
        await db.select().from(farmacie)
        .where(eq(farmacie.uuid, worksIn))
        .then(res => {
            userObj.worksIn = new Farmacia(res[0] as Omit<FarmaciaPayload, 'uuid'>)
        })
        .catch(err => {
            userObj.worksIn = undefined
        })
    }

    return {
        ...userObj,
        ...rest
    } as UserPayload
}

export class UserRepository implements IUserRepository {
    async createUser(u: NewUserParams): Promise<string> {
        return db
        .insert(users)
        .values({
            cf: u.cf,
            password: generate(u.password),
            fullname: u.fullname,
            firebase: u.firebase_token
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
        return db
        .select()
        .from(users)
        .where(eq(users.uuid, user_id))
        .then( getUserObject )
    }

    async verifyUser(u: VerifyUserParams): Promise<UserPayload> {
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
        } )
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
        .then( getUserObject )
    }

    async updateFarmaciaPreferita(user_id: string, f: UpdateUserParams): Promise<void> {
        return db
        .select({uuid: farmacie.uuid})
        .from(farmacie)
        .where(eq(farmacie.piva, f.farmacia_preferita))
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
}