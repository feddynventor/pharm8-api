import { QueryResult } from "pg";
import { db } from "../../core/database/connect";
import { eq, sql } from "drizzle-orm/sql";
import { farmacie, users } from "../../core/database/schema";

import { IFarmaciaRepository } from "../../core/interfaces/farmacia.iface";
import { NewFarmaciaParams, SignFarmaciaParams } from "../../core/schemas/farmacia.schema";
import { FarmaciaPayload } from "../../core/entities/farmacia";

export class FarmaciaRepository implements IFarmaciaRepository {
    async signFarmacia(user_id: string, utente: SignFarmaciaParams): Promise<void> {
        // user_id identifica l'utente che gestisce la farmacia da gestire
        // l'oggetto utente identifica l'utente da aggiungere alla farmacia tramite cf

        return db
        .select({worksIn: users.worksIn})
        .from(users)
        .where(eq(users.uuid, user_id))  // controlla che io sia un gestore di farmacia
        .then(async res => {
            if (res[0].worksIn){
                return db
                .update(users)
                .set({worksIn: res[0].worksIn})
                .where(eq(users.cf, utente.cf))
                .then()  //update AS a promise
            } else {
                throw new Error("Utente loggato non è un gestore di farmacia")
            }
        })
    }
    async newFarmacia(user_id: string, farmacia: NewFarmaciaParams): Promise<void> {
        return db
        .insert(farmacie)
        .values({
            nome: farmacia.nome,
            citta: farmacia.citta,
            codice_farmacia: farmacia.codice_farmacia
        })
        .returning({
            insertedId: farmacie.uuid
        })
        .then(async res => {
            return db
            .update(users)
            .set({worksIn: res[0].insertedId})
            .where(eq(users.uuid, user_id))
            .then(res => {
                if (res.rowCount==1) return
                else throw new Error("Utente non associabile")
            })
        })
        .catch(err => {
            throw new Error(err)
        })
    }
    async farmaciaFromCitta(citta: string): Promise<FarmaciaPayload[]> {
        return db
        .select()
        .from(farmacie)
        .where(eq(farmacie.citta, citta))
        .then(res => {
            return res.map(({
                uuid, citta, ...keep  //campi da interfaccia
            })=>keep) as FarmaciaPayload[]
        })
    }
    async farmaciaFromNome(nome: string, citta: string): Promise<FarmaciaPayload[]> {
        return db.execute(sql`select * from ${farmacie} where ${farmacie.citta} = ${citta} AND to_tsvector(${farmacie.nome}) @@ to_tsquery('simple',${nome+":*"})`)
        .then(res => {
            return res.rows.map(({
                uuid, ...keep   //campi tradotti da ORM
            })=>keep) as FarmaciaPayload[]
        })
    }
}