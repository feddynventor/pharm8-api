import { FarmaciaPayload } from "./farmacia";
import { ProdottoPayload } from "./prodotto";
import { User } from "./user";

export enum OrderStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DELIVERED = 'DELIVERED'
}

export interface Ordine {
    uuid: string;
    farmacia: FarmaciaPayload;
    prodotto: ProdottoPayload;
    utente: Omit<User, 'password'|'uuid'>;
    quantita: number;
    date: Date;
    status: OrderStatus;
}

export type OrdinePayload = Omit<Ordine, 'uuid'>;
export type OrdineUtente = Omit<Ordine, 'utente'>