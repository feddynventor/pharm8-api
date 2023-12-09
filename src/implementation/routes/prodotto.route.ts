import { RouteOptions } from "fastify";

import { IProdottoRepository } from "../../core/interfaces/prodotto.iface";
import { IMagazzinoRepository } from "../../core/interfaces/magazzino.iface";

import { getProdottoSchema, searchProdottoSchema } from "../../core/schemas/prodotto.schema";
import { checkDisponibilitaSchema } from "../../core/schemas/magazzino.schema";

import { getProdotto, searchProdotto,  } from "../controllers/prodotto.ctrl";
import { checkDisponibilita } from "../controllers/magazzino.ctrl";

export const prodottiRoutes = (prodottiRepository: IProdottoRepository, magazzinoRepository: IMagazzinoRepository): RouteOptions[] => ([
    {
        method: 'GET',
        url: '/:aic',   //URI param
        schema: getProdottoSchema,
        handler: getProdotto(prodottiRepository)
    },{
        method: 'GET',
        url: '/search', //URI query ?nome=<data>
        schema: searchProdottoSchema,
        handler: searchProdotto(prodottiRepository)
    },{
        method: 'GET',
        url: '/avail/:aic',
        schema: checkDisponibilitaSchema,
        handler: checkDisponibilita(magazzinoRepository)
    }
]) 