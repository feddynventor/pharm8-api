import { OrderStatus, Ordine, OrdineUtente } from "../entities/ordine"

export interface IOrdineRepository {
    newOrdine: (user_id: string, piva: string, aic: string, qt: number) => Promise<void>
    getListaOrdini: (user_id: string, status: OrderStatus) => Promise<Ordine[] | void[]>        //user_id belongs to gestore farmacia
    getOrdiniUtente: (user_id: string, status: OrderStatus) => Promise<OrdineUtente[] | void[]> //user_id belongs to utente
    dispatchOrdine: (order_id: string) => Promise<void>
}