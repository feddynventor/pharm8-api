import { FarmaciaPayload } from "./farmacia";
import { ProdottoPayload } from "./prodotto";

export interface Disponibilita {
    farmacia?: FarmaciaPayload,
    prodotto?: ProdottoPayload,
    quantita: number
}