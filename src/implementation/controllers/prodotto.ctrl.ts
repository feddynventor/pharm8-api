import { FastifyReply, FastifyRequest } from "fastify";

import { IProdottoRepository } from "../../core/interfaces/prodotto.iface";

import { GetProdottoParams, SearchProdottoParams } from "../../core/schemas/prodotto.schema";

export const searchProdotto = (
    prodottoRepository: IProdottoRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await prodottoRepository
    .searchProdotto( (request.query as SearchProdottoParams).nome as string )
    .then(res => {
        if (res.length == 0) reply.status(404)
        else reply.status(200).send(res)
    })
    .catch(err => {
        reply.status(500).send(err)
    })
}

export const getProdotto = (
    prodottoRepository: IProdottoRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await prodottoRepository
    .getProdotto( (request.params as GetProdottoParams).aic as string)
    .then(res => {
        reply.status(200).send(res)
    })
    .catch(err => {
        reply.status(404).send(err)
    })
}