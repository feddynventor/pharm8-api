import { FastifyReply, FastifyRequest } from "fastify"
import { User, UserToken } from "../../core/entities/user"

import { IMagazzinoRepository } from "../../core/interfaces/magazzino.iface"

import { CheckDisponibilitaParams, UpdateGiacenzaParams, UpdateGiacenzaQuery } from "../../core/schemas/magazzino.schema"

export const updateGiacenza = (
    magazzinoRepository: IMagazzinoRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {

    const { differenza, totale } = request.query as UpdateGiacenzaQuery
    if (!differenza && !totale) reply.status(400).send({message: "Dato di aggiornamento non specificato"})

    await magazzinoRepository
    .updateGiacenza(
        (request.user as UserToken).payload.uuid as string,     //utente gestore farmacia
        (request.params as UpdateGiacenzaParams).aic as string,
        differenza, totale
    ).then(res => {
        reply.status(200).send({qt: res})
    }).catch(err => {
        reply.status(400).send(err)
    })
}

export const checkDisponibilita = (
    magazzinoRepository: IMagazzinoRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await magazzinoRepository
    .checkDisponibilita( (request.params as CheckDisponibilitaParams).aic )
    .then( res => {
        reply.status(200).send(res)
    })
    .catch( err => {
        reply.status(400).send(err)
    })
}

export const listGiacenza = (
    magazzinoRepository: IMagazzinoRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    const farmacia_uuid = (request.user as User).worksIn?.uuid
    if (!farmacia_uuid) {
        reply.status(403).send("Utente non autorizzato")
        return
    }

    await magazzinoRepository
    .listGiacenza( farmacia_uuid )
    .then( res => {
        reply.status(200).send(res)
    })
    .catch( err => {
        reply.status(400).send(err)
    })
}