import { FastifyReply, FastifyRequest } from "fastify"
import { UserToken } from "../../core/entities/user"
import { Disponibilita } from "../../core/entities/disponibilita"

import { IMagazzinoRepository } from "../../core/interfaces/magazzino.iface"
import { UserRepository } from "../repositories/user.repo"

import { CheckDisponibilitaParams, CheckDisponibilitaQuery, UpdateGiacenzaParams, UpdateGiacenzaQuery } from "../../core/schemas/magazzino.schema"
import { getFarmaciaFromEditor } from "../repositories/common.repo"

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
    .checkDisponibilita( 
        (request.params as CheckDisponibilitaParams).aic
    )
    .then( async res => {
        let favourite: Disponibilita;
        await UserRepository
        .prototype.getUser((request.user as UserToken).payload.uuid as string)
        .then( user => {
            const favourite = res.filter( disp => disp.farmacia?.piva == user.favourite?.piva)[0] as Disponibilita
            reply.status(200).send({
                preferita: favourite,
                disponibilita: 
                    (request.query as CheckDisponibilitaQuery).tutte == "1"
                    ? res.filter( disp => disp.farmacia?.piva != user.favourite?.piva)
                    : res.filter( disp => disp.farmacia?.citta != user.citta && disp.farmacia?.piva != user.favourite?.piva)
            })
        })
    })
    .catch( err => {
        reply.status(400).send(err)
    })
}

export const listGiacenza = (
    magazzinoRepository: IMagazzinoRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    if (!(request.user as UserToken).user.worksIn) {
        reply.status(403).send({message: "Utente non autorizzato"})
        return
    }
    await getFarmaciaFromEditor( 
        (request.user as UserToken).payload.uuid as string )
    .then(magazzinoRepository.listGiacenza)
    .then( res => {
        reply.status(200).send(res)
    })
    .catch( err => {
        reply.status(400).send(err)
    })
}