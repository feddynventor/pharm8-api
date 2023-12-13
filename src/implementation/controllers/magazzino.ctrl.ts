import { FastifyReply, FastifyRequest } from "fastify"
import { UserToken } from "../../core/entities/user"

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
    MagazzinoRepository: IMagazzinoRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await MagazzinoRepository
    .checkDisponibilita( (request.params as CheckDisponibilitaParams).aic )
    .then( res => {
        reply.status(200).send(res)
    })
    .catch( err => {
        reply.status(400).send(err)
    })
}