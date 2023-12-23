import { RouteOptions } from "fastify";

import { IFarmaciaRepository } from "../../core/interfaces/farmacia.iface";
import { MagazzinoRepository } from "../repositories/magazzino.repo";

import { getFarmaciaSchema, newFarmaciaSchema } from "../../core/schemas/farmacia.schema";
import { updateGiacenzaSchema } from "../../core/schemas/magazzino.schema";

import { findFarmacia, newFarmacia } from "../controllers/farmacia.ctrl";
import { listGiacenza, updateGiacenza } from "../controllers/magazzino.ctrl";

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
      method: 'GET',
      url: '/mycity',
      schema: {
        description: "Ritorna tutte le farmacie della città dell'utente loggato",
        tags: ['farmacie'],
        security: [{ Bearer: [] }],
      },
      handler: findFarmacia(farmaciaRepository)
    },{
      method: 'POST',
      url: '/giacenza/:aic',
      schema: updateGiacenzaSchema,
      handler: updateGiacenza(magazzinoRepository)
    },{
      method: 'GET',
      url: '/giacenza',
      schema: {
        description: "Ritorna giacenza personale della farmacia",
        tags: ['magazzino'],
        security: [{ Bearer: [] }],
      },
      handler: listGiacenza(magazzinoRepository)
    }
  ])