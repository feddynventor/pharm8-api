import { db } from "../../core/database/connect";
import { SQL, and, eq, sql } from "drizzle-orm/sql";
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
        .select()
        .from(farmacie)
        .where( and(    // autentica con codice ministeriale e piva
            eq(farmacie.codice_farmacia, farmacia.codice_farmacia),
            eq(farmacie.piva, farmacia.piva)
        ) )
        .then(async res => {
            if (res.length==1){
                return db
                .update(users)
                .set({worksIn: res[0].uuid})
                .where(eq(users.uuid, user_id))
                .then()
            } else {
                throw new Error("Codice farmacia non valido")
            }
        })
    }
    /**
     * farmacie in cui almeno un utente lavora, o ha `worksIn` popolato
     * @param filters filtri SQL per la ricerca
     * @returns 
     */
    private async activeFarmacie(filters: SQL | undefined): Promise<FarmaciaPayload[]> {
        return db.query.farmacie.findMany({
            with: {
                worksIn: {
                    where: (users: { worksIn: any; }, {isNotNull}: any) => isNotNull(users.worksIn),
                    columns: {
                        cf: true
                    }
                },
            },
            columns: {
                uuid: false,
                codice_farmacia: false,
            },
            where: filters
        }).then(res => {
            if (!!res && res.length==0) throw new Error("Nessuna farmacia trovata")
            // else return res.filter(f => f.worksIn.length>0)
            else return res
        })
    }
    async farmaciaFromCitta(citta: string): Promise<FarmaciaPayload[]> {
        citta = citta.toUpperCase()
        return this.activeFarmacie( eq(farmacie.citta, citta) )
        .then()
    }
    async farmaciaFromNome(nome: string, citta: string): Promise<FarmaciaPayload[]> {
        citta = citta.toUpperCase()
        nome = nome.toUpperCase()
        return this.activeFarmacie( 
            and(
                eq(farmacie.citta, citta),
                sql`to_tsvector(${farmacie.nome}) @@ to_tsquery('simple',${nome+":*"})`
        )).then()
    }
    async farmaciaSearch(nome: string): Promise<FarmaciaPayload[]> {
        nome = nome.toUpperCase()
        return this.activeFarmacie( 
            sql`to_tsvector(${farmacie.nome}) @@ to_tsquery('simple',${nome+":*"})`
        ).then()
    }
}