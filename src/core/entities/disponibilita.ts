import { Farmacia } from "./farmacia";
import { Prodotto } from "./prodotto";

export interface Disponibilita {
    farmacia?: Farmacia,
    prodotto: Prodotto,
    quantita: number
}