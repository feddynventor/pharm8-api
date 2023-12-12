import { IOrdineRepository } from "../../core/interfaces/ordine.iface";
import { User, UserToken } from "../../core/entities/user";
import { FastifyRequest } from "fastify/types/request";
import { FastifyReply } from "fastify/types/reply";
import { GetListaOrdiniParams, NewOrdineParams } from "../../core/schemas/ordine.schema";
import { OrderStatus } from "../../core/entities/ordine";

export const newOrdine = (
    ordineRepository: IOrdineRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    const { piva, aic, qt } = request.body as NewOrdineParams
    await ordineRepository
    .newOrdine(
        (request.user as User).uuid,
        piva, aic, 
        qt? qt : 1
    )
    .catch(err => {
        reply.status(400).send(err)
    })
}


export const getListaOrdini = (
    ordineRepository: IOrdineRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await ordineRepository
    .getListaOrdini(
        (request.user as User).uuid,   //gestore Farmacia
        OrderStatus[ (request.query as GetListaOrdiniParams).status ]
    ).then(res => {
        if (res.length == 0) reply.code(404)
        else reply.send(res)
    })
    .catch(err => {
        reply.status(400).send(err)
    })
}