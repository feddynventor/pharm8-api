import { RouteOptions } from "fastify";

import { IFarmaciaRepository } from "../../core/interfaces/farmacia.iface";
import { MagazzinoRepository } from "../repositories/magazzino.repo";

import { getFarmaciaSchema, newFarmaciaSchema, signFarmaciaSchema } from "../../core/schemas/farmacia.schema";
import { updateGiacenzaSchema } from "../../core/schemas/magazzino.schema";

import { findFarmacia, newFarmacia, signFarmacia } from "../controllers/farmacia.ctrl";
import { updateGiacenza } from "../controllers/magazzino.ctrl";

export const farmaciaRoutes = (farmaciaRepository: IFarmaciaRepository, magazzinoRepository: MagazzinoRepository): RouteOptions[] => ([
    {
      method: 'POST',
      url: '/create',
      schema: newFarmaciaSchema,
      handler: newFarmacia(farmaciaRepository)
    },{
      method: 'GET',
      url: '/find',
      schema: getFarmaciaSchema,
      handler: findFarmacia(farmaciaRepository)
    },{
      method: 'POST',
      url: '/signin',
      schema: signFarmaciaSchema,
      handler: signFarmacia(farmaciaRepository)
    },{
      method: 'GET',
      url: '/giacenza/:aic',
      schema: updateGiacenzaSchema,
      handler: updateGiacenza(magazzinoRepository)
    }
  ])