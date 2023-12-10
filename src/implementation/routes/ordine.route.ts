import { RouteOptions } from "fastify";
import { IOrdineRepository } from "../../core/interfaces/ordine.iface";
import { newOrdineSchema } from "../../core/schemas/ordine.schema";
import { newOrdine } from "../controllers/ordine.ctrl";

export const ordiniRoutes = (ordineRepository: IOrdineRepository): RouteOptions[] => ([
    {
        method: 'POST',
        url: '/',
        schema: newOrdineSchema,
        handler: newOrdine(ordineRepository)
    }
])