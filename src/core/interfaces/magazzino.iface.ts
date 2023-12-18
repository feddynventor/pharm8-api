import { Disponibilita } from "../entities/disponibilita"

export interface IMagazzinoRepository {
    updateGiacenza: (user_id: string, aic: string, differenza?: number, totale?: number) => Promise<number>
    checkDisponibilita: (aic: string) => Promise<Disponibilita[]>
    listGiacenza: (user_id: string) => Promise<Disponibilita[]>
}