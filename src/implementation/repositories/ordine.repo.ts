import { and, eq } from "drizzle-orm/sql";
import { db } from "../../core/database/connect";
import { IOrdineRepository } from "../../core/interfaces/ordine.iface";
import { ordini } from "../../core/database/schema";

import * as common from "./common.repo";
import { Ordine } from "../../core/entities/ordine";

export class OrdineRepository implements IOrdineRepository {
    async newOrdine(user_id: string, piva: string, aic: string, qt: number): Promise<void> {
        return common.getFarmacoFromAIC(aic)
        .then(async farmaco_uuid => {
            return common.getFarmaciaFromPIVA(piva)
            .then(async farmacia_uuid => {
                
                return db
                .insert(ordini)
                .values({
                    farmacia: farmacia_uuid,
                    utente: user_id,
                    prodotto: farmaco_uuid,
                    quantita: qt.toString()
                })
                .then()

            })
        })
    }

    async getListaOrdini(user_id: string): Promise<Ordine[] | void[]> {
        return common.getFarmaciaFromEditor(user_id)
        .then(async farmacia_uuid => {
            return db.query.ordini.findMany({
                with: {
                    farmacia: true,
                    prodotto: true,
                    utente: true
                },
                where: and(
                    eq(ordini.utente, user_id),
                    eq(ordini.farmacia, farmacia_uuid)
                )
            }).then(res => {
                // if (res.length == 0) return []
                // return res as Ordine[]
                console.log(res)
                return []
            });
        });
    }
}