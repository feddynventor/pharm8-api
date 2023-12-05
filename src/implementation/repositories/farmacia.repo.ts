import { QueryResult } from "pg";
import { db } from "../../core/database/connect";
import { eq, sql } from "drizzle-orm/sql";
import { farmacie } from "../../core/database/schema";

import { IFarmaciaRepository } from "../../core/interfaces/farmacia.iface";
import { NewFarmaciaParams } from "../../core/schemas/farmacia.schema";
import { FarmaciaPayload } from "../../core/entities/farmacia";

export class FarmaciaRepository implements IFarmaciaRepository {
    async signFarmacia(user_id: string, farmacia: NewFarmaciaParams): Promise<boolean> {
        return db
        .insert(farmacie)
        .values({
            nome: farmacia.nome,
            citta: farmacia.citta,
            editor: user_id
        })
        .then(res => {
            if (res.rowCount && res.rowCount>0) return true
            else return false
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
                uuid, editor, ...keep  //campi da interfaccia
            })=>keep) as FarmaciaPayload[]
        })
    }
    async farmaciaFromNome(nome: string, citta: string): Promise<FarmaciaPayload[]> {
        return db.execute(sql`select * from ${farmacie} where ${farmacie.citta} = ${citta} AND to_tsvector(${farmacie.nome}) @@ to_tsquery('simple',${nome+":*"})`)
        .then(res => {
            return res.rows.map(({
                uuid, editor, ...keep   //campi tradotti da ORM
            })=>keep) as FarmaciaPayload[]
        })
    }
}