import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"

import { User, UserPayload, UserToken } from "../../core/entities/user"

import { IUserRepository } from "../../core/interfaces/user.iface"

import { NewUserParams, UpdateUserParams, VerifyUserParams } from "../../core/schemas/user.schema"
import { controllaCF } from "../helpers/cf_checker"

export const verifyUser = (
    userRepository: IUserRepository,
    server: FastifyInstance
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
    .verifyUser( request.body as VerifyUserParams )
    .then(res => {
            if (res) reply.status(200)
                .send({ token: server.jwt.sign({
                    payload: {uuid: res}
                }) })
            else
                reply.status(401)
        })
        .catch(err => {
            reply.status(400).send(err)
        })
}

export const whoami = 
() => async function (request: FastifyRequest, reply: FastifyReply) {
    reply.status(200).send((request.user as UserToken).user as UserPayload)
}

export const createUser = (
    userRepository: IUserRepository,
    server: FastifyInstance
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await controllaCF( (request.body as NewUserParams).cf )
    .then(async () => {
        await userRepository
        .createUser( request.body as NewUserParams )
        .then((res) => {
            if (res) reply.status(200)
                .send({ token: server.jwt.sign({
                    payload: {uuid: res}
                }) })
            else
                reply.status(401)
        }).catch(()=>{
            reply.status(400).send({message: "Utente già registrato"})
        })
    }).catch(()=>{
        reply.status(400).send({message: "Codice fiscale non valido"})
    })
}

export const deleteUser = (
    userRepository: IUserRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
    .deleteUser( 
        (request.user as UserToken).payload.uuid,
        (request.user as UserToken).user.worksIn?.piva )
    .then( () => {
        reply.status(200)
    })
    .catch( err => {
        reply.status(400).send({message: err.toString()})
    })
}

export const removeFarmaciaPreferita = (
    userRepository: IUserRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
    .removeFarmaciaPreferita( 
        (request.user as UserToken).payload.uuid
    ).then(() => {
        reply.status(200)
    })
    .catch(err => {
        reply.status(400).send(err)
    })
}

export const updateUser = (
    userRepository: IUserRepository,
) => async function (request: FastifyRequest, reply: FastifyReply) {

    const { citta, farmacia_preferita: piva } = request.body as UpdateUserParams

    if (piva) {
        await userRepository
            .updateFarmaciaPreferita( 
                (request.user as UserToken).payload.uuid,
                piva
            ).then(() => {
                reply.status(200)
            })
            .catch(err => {
                reply.status(400).send(err)
            })
    } else if (citta) {
        await userRepository
            .updateCitta(
                (request.user as UserToken).payload.uuid,
                citta
            ).then(() => {
                reply.status(200)
            })
            .catch(err => {
                reply.status(400).send(err)
            })
    } else {
        reply.status(400).send({message: "Richiesta errata"})
    }
}