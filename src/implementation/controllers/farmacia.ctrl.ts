import { FastifyReply, FastifyRequest } from "fastify";

import { UserPayload, UserToken } from "../../core/entities/user";

import { IFarmaciaRepository } from "../../core/interfaces/farmacia.iface";
import { GetFarmaciaParams, NewFarmaciaParams, SignFarmaciaParams } from "../../core/schemas/farmacia.schema";

export const newFarmacia = (
    farmaciaRepository: IFarmaciaRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await farmaciaRepository
    .newFarmacia(
        (request.user as UserToken).payload.uuid,
        request.body as NewFarmaciaParams
    ).then(() => {
        reply.status(201)
    })
    .catch(err => {
        reply.status(400).send(err)
    })
}

export const signFarmacia = (
    farmaciaRepository: IFarmaciaRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await farmaciaRepository
    .signFarmacia(
        (request.user as UserToken).payload.uuid,
        request.body as SignFarmaciaParams
    ).then(() => {
        reply.status(200)
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
            else reply.status(404).send({mwssage: "Nessun risultato"})
        })
        .catch(err => {
            reply.status(500).send(err)
        })
    } else {
        await farmaciaRepository
        .farmaciaFromCitta(data.citta)
        .then(res => {
            if (res.length>0) reply.status(200).send(res)
            else reply.status(404).send({message: "Nessuna farmacia in questa citta"})
        })
        .catch(err => {
            reply.status(500).send(err)
        })
    }
}

export const myCityFarmacie = (
    farmaciaRepository: IFarmaciaRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    const {citta} = (request.user as UserToken).user as UserPayload
    if (!citta) {
        reply.status(404).send({message: "Utente non ha citta"})
        return
    }
    await farmaciaRepository
    .farmaciaFromCitta( citta )
    .then( res => {
        console.log(res)
        if (res.length==0) reply.status(404).send({message: "Nessuna farmacia nella tua citta"})
        else reply.status(200).send(res)
    })
}