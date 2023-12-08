import { RouteOptions } from "fastify";

import { IFarmaciaRepository } from "../../core/interfaces/farmacia.iface";
import { getFarmaciaSchema, newFarmaciaSchema, signFarmaciaSchema } from "../../core/schemas/farmacia.schema";

import { findFarmacia, newFarmacia, signFarmacia } from "../controllers/farmacia.ctrl";

export const farmaciaRoutes = (farmaciaRepository: IFarmaciaRepository): RouteOptions[] => ([
    {
      method: 'POST',
      url: '/add',
      schema: newFarmaciaSchema,
      handler: newFarmacia(farmaciaRepository)
    },{
      method: 'GET',
      url: '/find',
      schema: getFarmaciaSchema,
      handler: findFarmacia(farmaciaRepository)
    },{
      method: 'POST',
      url: '/sign',
      schema: signFarmaciaSchema,
      handler: signFarmacia(farmaciaRepository)
    }
  ])