import { FastifyReply, FastifyRequest } from "fastify";

import { UserToken } from "../../core/entities/user";

import { IFarmaciaRepository } from "../../core/interfaces/farmacia.iface";
import { GetFarmaciaParams, NewFarmaciaParams } from "../../core/schemas/farmacia.schema";

export const signFarmacia = (
    farmaciaRepository: IFarmaciaRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await farmaciaRepository
    .signFarmacia(
        (request.user as UserToken).payload.uuid,
        request.body as NewFarmaciaParams
    ).then(res => {
        reply.status(201)
    })
    .catch(err => {
        reply.status(400).send(err)
    })
}

export const findFarmacia = (
    farmaciaRepository: IFarmaciaRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {

    const data = request.query as GetFarmaciaParams

    if (typeof data.nome !== "undefined"){
        await farmaciaRepository
        .farmaciaFromNome(data.nome,data.citta)
        .then(res => {
            if (res.length>0) reply.status(200).send(res)
            else reply.status(404).send("Nessun risultato")
        })
        .catch(err => {
            reply.status(500).send(err)
        })
    } else {
        await farmaciaRepository
        .farmaciaFromCitta(data.citta)
        .then(res => {
            if (res.length>0) reply.status(200).send(res)
            else reply.status(404).send("Nessuna farmacia in questa citta")
        })
        .catch(err => {
            reply.status(500).send(err)
        })
    }

}


export const listCitta = (
    farmaciaRepository: IFarmaciaRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {

    await farmaciaRepository
    .listCitta()
    .then(res => {
        reply.status(200).send(res)
    })
    .catch(err => {
        reply.status(400).send(err)
    })

}