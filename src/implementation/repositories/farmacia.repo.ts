import { db } from "../../core/database/connect";
import { eq, sql } from "drizzle-orm/sql";
import { farmacie } from "../../core/database/schema";

import { IFarmaciaRepository } from "../../core/interfaces/farmacia.iface";
import { NewFarmaciaParams } from "../../core/schemas/farmacia.schema";
import { FarmaciaPayload } from "../../core/entities/farmacia";

export class FarmaciaRepository implements IFarmaciaRepository {
    async newFarmacia(user_id: string, farmacia: NewFarmaciaParams): Promise<void> {
        return db
        .insert(farmacie)
        .values({
            nome: farmacia.nome,
            citta: farmacia.citta.toUpperCase(),
            codice_farmacia: farmacia.codice_farmacia,
            gestore: user_id
        })
        .returning({
            insertedId: farmacie.uuid
        })
        .then()
    }
    async farmaciaFromCitta(citta: string): Promise<FarmaciaPayload[]> {
        return db.query.farmacie.findMany({
            columns: {
                uuid: false,
                gestore: false,
                citta: false
            },
            where: eq(farmacie.citta, citta.toUpperCase())
        }).then()
    }
    async farmaciaFromNome(nome: string, citta: string): Promise<FarmaciaPayload[]> {
        return db.execute(sql`select * from ${farmacie} where ${farmacie.citta} = ${citta.toUpperCase()} AND to_tsvector(${farmacie.nome}) @@ to_tsquery('simple',${nome+":*"})`)
        .then(res => {
            return res.rows.map(({
                uuid, citta, gestore, ...keep   //campi tradotti da interfaccia ORM
            })=>keep) as FarmaciaPayload[]
        })
    }
}