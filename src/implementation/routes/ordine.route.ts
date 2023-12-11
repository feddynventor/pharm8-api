import { RouteOptions } from "fastify";
import { IOrdineRepository } from "../../core/interfaces/ordine.iface";
import { getListaOrdiniSchema, newOrdineSchema } from "../../core/schemas/ordine.schema";
import { getListaOrdini, newOrdine } from "../controllers/ordine.ctrl";

export const ordiniRoutes = (ordineRepository: IOrdineRepository): RouteOptions[] => ([
    {
        method: 'POST',
        url: '/',
        schema: newOrdineSchema,
        handler: newOrdine(ordineRepository)
    },{
        method: 'GET',
        url: '/',
        schema: getListaOrdiniSchema,
        handler: getListaOrdini(ordineRepository)
    }
])