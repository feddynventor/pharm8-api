import { Farmacia, FarmaciaPayload } from "../entities/farmacia"

export interface IMagazzinoRepository {
    updateGiacenza: (user_id: string, aic: string, differenza?: number, totale?: number) => Promise<number>
    checkDisponibilita: (aic: string, user_id?: string) => Promise<{f: FarmaciaPayload, qt: number}[]>
}