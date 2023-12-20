import { sql } from "drizzle-orm/sql"
import { db } from "../../core/database/connect"
import { farmacie, magazzino, prodotti, users } from "../../core/database/schema"
import { and, eq } from "drizzle-orm/sql/expressions"

export const getFarmaciaFromEditor = async (user_id: string): Promise<string> => {
    return db
    .select({farmacia_uuid: users.worksIn})
    .from(users)
    .where(eq(users.uuid, user_id))
    .then(res => {
        if (res.length==0 || !res[0].farmacia_uuid) throw new Error("Utente non è un gestore di farmacia")
        else return res[0].farmacia_uuid
    })
}
export const getFarmacoFromAIC = async (aic: string): Promise<string> => {
    return db
    .select({uuid: prodotti.uuid})
    .from(prodotti)
    .where(eq(prodotti.aic, aic))
    .then(res => {
        if (res.length==0) throw new Error("Prodotto inesistente")
        else return res[0].uuid
    })
}

export const updateGiacenza = async (farmacia_uuid: string, farmaco_uuid: string, differenza?: number, totale?: number): Promise<number> => {
    return db.transaction( async (tx) => {
        return tx
        .select()
        .from(magazzino)
        .where(
            and(
                eq(magazzino.farmacia, farmacia_uuid),
                eq(magazzino.prodotto, farmaco_uuid)
            )
        ).then( async res => {
            if (res.length!=0){
                return tx
                .update(magazzino)
                .set({ quantita: (!!differenza) ? res[0].quantita+differenza : totale })
                .where(and(
                    eq(magazzino.farmacia, farmacia_uuid),
                    eq(magazzino.prodotto, farmaco_uuid)
                ))
                .returning({
                    newQta: magazzino.quantita
                })
                .then( async res => {
                    if (res[0].newQta < 0) {
                        // tx.rollback()
                        throw new Error(
                            "Disponibilita in magazzino non sufficiente per "
                            +(res[0].newQta*-1)+" unita"
                            )  //`throw` triggers Rollback
                    } else {
                        return res[0].newQta
                    }
                })
            } else {
                if (differenza && differenza<0) throw new Error("Prodotto non ancora presente in magazzino. Valore invalido.")
                return tx
                .insert(magazzino)
                .values({
                    farmacia: farmacia_uuid,
                    prodotto: farmaco_uuid,
                    quantita: (!!differenza) ? sql`${differenza}` : sql`${totale}`
                })
                .returning({
                    newQta: magazzino.quantita
                })
                .then( res =>{
                    return res[0].newQta
                })
            }
        })
    })
}