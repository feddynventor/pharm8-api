import { Farmacia, FarmaciaPayload } from "../entities/farmacia";
import { ListCittaResponse } from "../schemas/farmacia.schema";

export interface IFarmaciaRepository {
    signFarmacia: (user_id: string, farmacia: FarmaciaPayload) => Promise<boolean>
    farmaciaFromCitta: (citta: string) => Promise<FarmaciaPayload[]>
    farmaciaFromNome: (nome: string, citta: string) => Promise<FarmaciaPayload[]>
    listCitta: () => Promise<ListCittaResponse>
}