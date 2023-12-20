import { Farmacia, FarmaciaPayload } from "../entities/farmacia";
import { NewFarmaciaParams, SignFarmaciaParams } from "../schemas/farmacia.schema";

export interface IFarmaciaRepository {
    newFarmacia: (user_id: string, farmacia: NewFarmaciaParams) => Promise<void>
    signFarmacia: (user_id: string, utente: SignFarmaciaParams) => Promise<void>
    farmaciaFromCitta: (citta: string) => Promise<FarmaciaPayload[]>
    farmaciaFromNome: (nome: string, citta: string) => Promise<FarmaciaPayload[]>
}