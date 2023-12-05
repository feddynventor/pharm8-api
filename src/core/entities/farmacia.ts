import { User } from "./user"

export interface Farmacia {
    uuid: string
    nome: string
    citta: string
    editor: User
}
export type FarmaciaPayload = Omit<Farmacia, 'uuid'|'editor'>