import { db } from "../../core/database/connect";
import { and, eq, sql } from "drizzle-orm/sql";
import { farmacie, magazzino } from "../../core/database/schema";
import * as common from "./common.repo";

import { FarmaciaPayload } from "../../core/entities/farmacia";

import { IMagazzinoRepository } from "../../core/interfaces/magazzino.iface";

export class MagazzinoRepository implements IMagazzinoRepository {
    async updateGiacenza(user_id: string, aic: string, differenza?: number, totale?: number): Promise<number> {        
        return common.getFarmaciaFromEditor(user_id)   // giacenza controllabile solo da gestore di farmacia
        .then(async farmacia_uuid => {
            return common.getFarmacoFromAIC(aic)       // aic identifica il prodotto da aggiornare, UUID la relativa chiave esterna
            .then(async farmaco_uuid => {
                return db.transaction( async (tx) => {
                    return tx
                    .update(magazzino)
                    .set({ quantita: (!!differenza) ? sql`${magazzino.quantita} + ${differenza}` : sql`${totale}` })
                    .where(and(
                        eq(magazzino.farmacia, farmacia_uuid),
                        eq(magazzino.prodotto, farmaco_uuid)
                    ))
                    .returning({
                        newQta: magazzino.quantita
                    })
                    .then( async res => {
                        if (res.length==0) {    //no record to update
                            await db
                            .insert(magazzino)
                            .values({
                                farmacia: farmacia_uuid,
                                prodotto: farmaco_uuid,
                                quantita: (!!differenza) ? sql`${magazzino.quantita} + ${differenza}` : sql`${totale}`
                            })
                            .returning({
                                newQta: magazzino.quantita
                            })
                            .then( res =>{
                                return res[0].newQta
                            })
                        } else if (res[0].newQta < 0) {
                            // tx.rollback()
                            throw new Error(
                                "Disponibilita in magazzino non sufficiente per "
                                +(res[0].newQta*-1)+" unita"
                                )  //`throw` triggers Rollback
                        } else {    //update OK
                            return res[0].newQta
                        }
                    })
                    .catch( err => {
                        if (err.code == "42P01") throw new Error("Prodotto non presente in magazzino")  //increment macro fallisce
                        else throw new Error(err)
                    })
                }).then()  //transaction AS a promise

            })
        })
    }

    async checkDisponibilita(aic: string): Promise<{f: FarmaciaPayload, qt: number}[]> {
        return common.getFarmacoFromAIC(aic)
        .then( async farmaco_uuid => {
            return db
            .select()
            .from(magazzino)
            .where(eq(magazzino.prodotto, farmaco_uuid))
            .innerJoin(farmacie, eq(magazzino.farmacia, farmacie.uuid))
            .then( res => {

                if (res.length == 0) throw new Error("Nessuna farmacia con prodotto disponibile")

                return res.map( f => {
                    const { uuid, ...rest } = f.farmacie
                    return {
                        f: rest,
                        qt: f.magazzino.quantita
                    }
                })
            })
        })
    }
}
