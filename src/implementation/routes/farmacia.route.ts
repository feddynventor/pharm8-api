import { RouteOptions } from "fastify";

import { IFarmaciaRepository } from "../../core/interfaces/farmacia.iface";
import { getFarmaciaSchema, newFarmaciaSchema } from "../../core/schemas/farmacia.schema";

import { findFarmacia, signFarmacia } from "../controllers/farmacia.ctrl";

export const farmaciaRoutes = (farmaciaRepository: IFarmaciaRepository): RouteOptions[] => ([
    {
      method: 'POST',
      url: '/sign',
      schema: newFarmaciaSchema,
      handler: signFarmacia(farmaciaRepository)
    },{
      method: 'GET',
      url: '/find',
      schema: getFarmaciaSchema,
      handler: findFarmacia(farmaciaRepository)
    }
  ])