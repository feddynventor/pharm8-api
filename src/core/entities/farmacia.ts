export interface Farmacia {
    uuid: string
    nome: string
    citta: string
    piva: string
}
export type FarmaciaPayload = Omit<Farmacia, 'uuid'>

export class Farmacia implements Farmacia{
    constructor(obj: FarmaciaPayload){
        Object.assign(this, obj)
    }
}