import { ProdottoPayload } from "../entities/prodotto"

export interface IProdottoRepository {
    getProdotto: (aic: string) => Promise<ProdottoPayload>
    searchProdotto: (nome: string) => Promise<ProdottoPayload[]>
}