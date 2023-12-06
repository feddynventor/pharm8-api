import { RouteOptions } from "fastify";

import { IFarmaciaRepository } from "../../core/interfaces/farmacia.iface";
import { getFarmaciaSchema, listCittaSchema, newFarmaciaSchema } from "../../core/schemas/farmacia.schema";

import { findFarmacia, listCitta, signFarmacia } from "../controllers/farmacia.ctrl";

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
    },{
      method: 'GET',
      url: '/list',
      schema: listCittaSchema,
      handler: listCitta(farmaciaRepository)
    }
  ])