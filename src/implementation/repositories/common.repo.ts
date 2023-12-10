import { db } from "../../core/database/connect"
import { farmacie, prodotti, users } from "../../core/database/schema"
import { eq } from "drizzle-orm/sql/expressions"

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
export const getFarmaciaFromPIVA = async (piva: string): Promise<string> => {
    return db
    .select({farmacia_uuid: farmacie.uuid})
    .from(farmacie)
    .where(eq(farmacie.piva, piva))
    .then(res => {
        if (res.length==0 || !res[0].farmacia_uuid) throw new Error("Farmacia inesistente")
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