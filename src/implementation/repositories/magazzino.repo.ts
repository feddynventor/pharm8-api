import { db } from "../../core/database/connect";
import { and, eq, sql } from "drizzle-orm/sql";
import { farmacie, magazzino } from "../../core/database/schema";
import * as common from "./common.repo";

import { IMagazzinoRepository } from "../../core/interfaces/magazzino.iface";
import { Disponibilita } from "../../core/entities/disponibilita";

export class MagazzinoRepository implements IMagazzinoRepository {
    async updateGiacenza(user_id: string, aic: string, differenza?: number, totale?: number): Promise<number> {        
        return common.getFarmaciaFromEditor(user_id)   // giacenza controllabile solo da gestore di farmacia
        .then(async farmacia_uuid => {
            return common.getFarmacoFromAIC(aic)       // aic identifica il prodotto da aggiornare, UUID la relativa chiave esterna
            .then(async farmaco_uuid => {
                
                return common.updateGiacenza(farmacia_uuid, farmaco_uuid, differenza, totale)

            })
        })
    }

    async listGiacenza(farmacia_uuid: string): Promise<Disponibilita[]> {
        return db.query.magazzino.findMany({
            with: {
                prodotto: true
            },
            columns: {
                uuid: false,
                farmacia: false
            },
            where: eq(magazzino.farmacia, farmacia_uuid)
            }
        ).then( (res) => {
            if (res.length == 0) throw new Error("Nessun prodotto in magazzino")
            else return res
        })
    }

    async checkDisponibilita(aic: string): Promise<Disponibilita[]> {
        return common.getFarmacoFromAIC(aic)
        .then( async farmaco_uuid => {
            return db.query.magazzino.findMany({
                with: {
                    farmacia: true,
                    prodotto: true
                },
                columns: {
                    uuid: false
                },
                where: and(
                    eq(magazzino.prodotto, farmaco_uuid),
                    sql`magazzino.quantita > 0`
                )
            }).then( res => {
                if (res.length == 0) throw new Error("Nessuna farmacia con prodotto disponibile")
                else return res  
            })
        })
    }
}
