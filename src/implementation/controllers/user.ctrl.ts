import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"

import { User, UserToken } from "../../core/entities/user"

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
    reply.status(200).send({ ip: request.socket.remoteAddress, user: request.user as User})
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
        })
    }).catch(()=>{
        reply.status(400).send({message: "Codice fiscale non valido"})
    })
}

export const updateUser = (
    userRepository: IUserRepository,
) => async function (request: FastifyRequest, reply: FastifyReply) {

    // ALTRE PROPRIETA
    await userRepository
        .updateFarmaciaPreferita( 
            (request.user as UserToken).payload.uuid,
            request.body as UpdateUserParams
        ).then(() => {
            reply.status(200)
        })
        .catch(err => {
            reply.status(400).send(err)
        })
}