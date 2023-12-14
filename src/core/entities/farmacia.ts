export interface Farmacia {
    uuid: string
    nome: string
    citta: string
    codice_farmacia: string
    indirizzo: string
}
export type FarmaciaPayload = Omit<Farmacia, 'uuid'>

export class Farmacia implements Farmacia{
    constructor(obj: FarmaciaPayload){
        Object.assign(this, obj)
    }
}