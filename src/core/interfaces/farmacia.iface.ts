import { FarmaciaPayload } from "../entities/farmacia";
import { NewFarmaciaParams } from "../schemas/farmacia.schema";

export interface IFarmaciaRepository {
    newFarmacia: (user_id: string, farmacia: NewFarmaciaParams) => Promise<void>
    farmaciaFromCitta: (citta: string) => Promise<FarmaciaPayload[]>
    farmaciaFromNome: (nome: string, citta: string) => Promise<FarmaciaPayload[]>
}