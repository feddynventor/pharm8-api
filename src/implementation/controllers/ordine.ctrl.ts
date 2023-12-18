import { IOrdineRepository } from "../../core/interfaces/ordine.iface";
import { User, UserToken } from "../../core/entities/user";
import { FastifyRequest } from "fastify/types/request";
import { FastifyReply } from "fastify/types/reply";
import { ApprovaOrdineParams, GetListaOrdiniParams, NewOrdineParams } from "../../core/schemas/ordine.schema";
import { OrderStatus } from "../../core/entities/ordine";

export const newOrdine = (
    ordineRepository: IOrdineRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    const { codice_farmacia, aic, qt } = request.body as NewOrdineParams
    await ordineRepository
    .newOrdine(
        (request.user as UserToken).payload.uuid,
        codice_farmacia, aic, 
        qt? qt : 1
    )
    .catch(err => {
        reply.status(400).send(err)
    })
}


export const getListaOrdini = (
    ordineRepository: IOrdineRepository,
    tipo: "UTENTE"|"FARMACIA"
) => async function (request: FastifyRequest, reply: FastifyReply) {
    if (tipo=="FARMACIA") {
        if (!(request.user as UserToken).user.worksIn) reply.status(403).send({message: "Utente non autorizzato"})
        await ordineRepository
        .getListaOrdini(
            (request.user as UserToken).payload.uuid,   //gestore Farmacia
            OrderStatus[ (request.query as GetListaOrdiniParams).status ]
        ).then(res => {
            if (res.length == 0) reply.code(404)
            else reply.send(res)
        })
        .catch(err => {
            reply.status(400).send(err)
        })
    } else if (tipo=="UTENTE")
        await ordineRepository
        .getOrdiniUtente(
            (request.user as UserToken).payload.uuid,   //utente loggato
            OrderStatus[ (request.query as GetListaOrdiniParams).status ]
        ).then(res => {
            if (res.length == 0) reply.code(404)
            else reply.send(res)
        })
        .catch(err => {
            reply.status(400).send(err)
        })
}


export const dispatchOrdine = (
    ordineRepository: IOrdineRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await ordineRepository
    .dispatchOrdine(
        (request.query as ApprovaOrdineParams).uuid
    ).then( () => {
        reply.code(200)
    })
    .catch(err => {
        reply.status(400).send(err)
    })
}