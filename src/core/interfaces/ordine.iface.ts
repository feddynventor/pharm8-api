import { Ordine } from "../entities/ordine"

export interface IOrdineRepository {
    newOrdine: (user_id: string, piva: string, aic: string, qt: number) => Promise<void>
    getListaOrdini: (user_id: string) => Promise<Ordine[] | void[]>  //user_id belongs to gestore farmacia
}