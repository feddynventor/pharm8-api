import { ProdottoPayload } from "../../core/entities/prodotto";
import { IProdottoRepository } from "../../core/interfaces/prodotto.iface";

import { db } from "../../core/database/connect";
import { prodotti } from "../../core/database/schema";
import { eq, sql } from "drizzle-orm/sql";

export class ProdottoRepository implements IProdottoRepository {
    async getProdotto(aic: string): Promise<ProdottoPayload> {
        return db
        .select()
        .from(prodotti)
        .where(eq(prodotti.aic, aic))
        .then(res => {
            if (res.length == 0) throw new Error("Prodotto non trovato")
            return res[0] as ProdottoPayload
        })
        .catch(err => {
            throw new Error(err)
        })
    }

    async searchProdotto(nome: string): Promise<ProdottoPayload[]> {
        return db.execute(sql`select * from ${prodotti} where to_tsvector(${prodotti.nome}) @@ to_tsquery('simple',${nome+":*"})`)
        .then(res => {
            return res.rows.map(({
                uuid, ...keep
            })=>keep) as ProdottoPayload[]
        })
    }
}