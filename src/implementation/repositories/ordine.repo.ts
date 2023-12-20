import { and, eq, sql } from "drizzle-orm/sql";
import { db } from "../../core/database/connect";
import { farmacie, ordini, prodotti } from "../../core/database/schema";

import { IOrdineRepository } from "../../core/interfaces/ordine.iface";
import { MagazzinoRepository } from "./magazzino.repo";

import * as common from "./common.repo";
import { OrderStatus, Ordine, OrdineUtente } from "../../core/entities/ordine";

import { sendNotification } from "../../firebase";

export class OrdineRepository implements IOrdineRepository {
    async newOrdine(user_id: string, codice_farmacia: string, aic: string, qt_richiesta: number): Promise<void> {
        return MagazzinoRepository.prototype.checkDisponibilita(aic)
        .then( async res => {
            const disponibilita = res.filter( d => d.farmacia?.codice_farmacia == codice_farmacia)
            if (disponibilita.length == 0) 
                throw new Error("La farmacia selezionata non ha questo prodotto disponibile")
            
            const {prodotto, quantita, farmacia} = disponibilita[0]
            if (quantita < qt_richiesta) 
                throw new Error("Quantità richiesta non disponibile dalla farmacia selezionata")
            
            if (!farmacia) return;
            
            const {uuid: prodotto_uuid} = await db.query.prodotti.findFirst({
                where: eq(prodotti.aic, aic)
            }) || {}
            const {uuid: farmacia_uuid} = await db.query.farmacie.findFirst({
                where: eq(farmacie.codice_farmacia, codice_farmacia)
            }) || {}

            if (!farmacia_uuid || !prodotto_uuid) return;
            
            return db
            .insert(ordini)
            .values({
                farmacia: farmacia_uuid,
                prodotto: prodotto_uuid,
                utente: user_id,
                quantita: qt_richiesta
            })
            .then()
        })
    }

    async getListaOrdini(user_id: string, status: OrderStatus): Promise<Ordine[] | void[]> {
        return common.getFarmaciaFromEditor(user_id)
        .then(async farmacia_uuid => {
            return db.query.ordini.findMany({
                with: {
                    prodotto: {
                        columns: {
                            uuid: false
                        }
                    },
                    utente: {
                        columns: {
                            cf: true,
                            fullname: true,
                            citta: true
                        }
                    }
                },
                columns: {
                    farmacia: false
                },
                where: and(
                    eq(ordini.farmacia, farmacia_uuid),
                    eq(ordini.status, status)
                )
            }).then(res => {
                if (res.length == 0) return []
                return res as Ordine[]
            });
        });
    }

    async getOrdiniUtente(user_id: string, status: OrderStatus): Promise<OrdineUtente[] | void[]> {
        return db.query.ordini.findMany({
            with: {
                // farmacia: true,
                // prodotto: true,
                farmacia: {
                    columns: {
                        uuid: false
                    }
                },
                prodotto: {
                    columns: {
                        uuid: false
                    }
                },
            },
            columns: {
                utente: false,
            },
            where: and(
                eq(ordini.utente, user_id),
                eq(ordini.status, status)
            )
        }).then(res => {
            if (res.length == 0) return []
            return res as OrdineUtente[]
        });
    }

    async dispatchOrdine(order_id: string): Promise<void> {
        return db.query.ordini.findFirst({
            with: {
                farmacia: {
                    columns: {
                        uuid: true
                    }
                },
                prodotto: {
                    columns: {
                        uuid: true,
                        nome: true
                    }
                },
                utente: {
                    columns: {
                        firebase: true
                    }
                }
            },
            where: and(
                eq(ordini.uuid, order_id),
                eq(ordini.status, OrderStatus.PENDING)
            )
        })
        .then(async res => {
            if (!res) throw new Error("Ordine non trovato!")

            return common
            .updateGiacenza(res.farmacia.uuid, res.prodotto.uuid, res.quantita*-1)
            .then( async ()=>{
                return db
                .update(ordini)
                .set({
                    status: OrderStatus.ACCEPTED,
                    aggiornato: sql`now()`
                })
                .where(eq(ordini.uuid, order_id))
                .then( async ()=>{
                    if (!res.utente.firebase) return
                    await sendNotification(
                        "Ordine per "+res.quantita+"x "+res.prodotto.nome,
                        res.utente.firebase
                    )
                })
            })
            
            
        })
    }

    async deliverOrdine(order_id: string): Promise<void> {
        return db.query.ordini.findFirst({
            with: {
                farmacia: {
                    columns: {
                        uuid: true
                    }
                },
                prodotto: {
                    columns: {
                        uuid: true,
                        nome: true
                    }
                },
                utente: {
                    columns: {
                        firebase: true
                    }
                }
            },
            where: and(
                eq(ordini.uuid, order_id),
                eq(ordini.status, OrderStatus.ACCEPTED)
            )
        })
        .then(async res => {
            if (!res) throw new Error("Ordine non trovato!")

            return db
            .update(ordini)
            .set({
                status: OrderStatus.DELIVERED,
                aggiornato: sql`now()`
            })
            .where(eq(ordini.uuid, order_id))
            .then( async ()=>{
                if (!res.utente.firebase) return
                await sendNotification(
                    "Hai ritirato "+res.quantita+"x "+res.prodotto.nome,
                    res.utente.firebase
                )
            })
        })
    }
}