import { Farmacia } from "./farmacia";
import { Prodotto } from "./prodotto";
import { User } from "./user";

export enum OrderStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DELIVERED = 'DELIVERED'
}

export interface Ordine {
    uuid: string;
    farmacia: Farmacia;
    utente: User;
    prodotto: Prodotto;
    quantita: number;
    date: Date;
    status: OrderStatus;
}

export type OrdinePayload = Omit<Ordine, 'uuid'>;