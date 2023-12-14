import { RouteOptions } from "fastify";
import { IOrdineRepository } from "../../core/interfaces/ordine.iface";
import { getListaOrdiniSchema, newOrdineSchema, approvaOrdineSchema } from "../../core/schemas/ordine.schema";
import { dispatchOrdine, getListaOrdini, newOrdine } from "../controllers/ordine.ctrl";

export const ordiniRoutes = (ordineRepository: IOrdineRepository): RouteOptions[] => ([
    {
        method: 'POST',
        url: '/',
        schema: newOrdineSchema,
        handler: newOrdine(ordineRepository)
    },{
        method: 'GET',
        url: '/farmacia',
        schema: {
            ...getListaOrdiniSchema,
            tags: ['ordini','farmacie'],
        },
        handler: getListaOrdini(ordineRepository, "FARMACIA")
    },{
        method: 'GET',
        url: '/utente',
        schema: {
            ...getListaOrdiniSchema,
            tags: ['ordini','user'],
        },
        handler: getListaOrdini(ordineRepository, "UTENTE")
    },{
        method: 'PUT',
        url: '/accept',
        schema: approvaOrdineSchema,
        handler: dispatchOrdine(ordineRepository)
    }
])