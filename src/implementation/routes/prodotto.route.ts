import { RouteOptions } from "fastify";
import { IProdottoRepository } from "../../core/interfaces/prodotto.iface";
import { getProdotto, searchProdotto,  } from "../controllers/prodotto.ctrl";
import { getProdottoSchema, searchProdottoSchema } from "../../core/schemas/prodotto.schema";

export const prodottiRoutes = (prodottiRepository: IProdottoRepository): RouteOptions[] => ([
    {
        method: 'GET',
        url: '/:aic',   //URI param
        schema: getProdottoSchema,
        handler: getProdotto(prodottiRepository)
    },
    {
        method: 'GET',
        url: '/search', //URI query ?nome=<data>
        schema: searchProdottoSchema,
        handler: searchProdotto(prodottiRepository)
    }
]) 