export interface Farmacia {
    uuid: string
    nome: string
    citta: string
    indirizzo: string
    codice_farmacia: number
    piva: string
}
export type FarmaciaPayload = Omit<Farmacia, 'uuid'|'codice_farmacia'>

export class Farmacia implements Farmacia{
    constructor(obj: FarmaciaPayload){
        Object.assign(this, obj)
    }
}