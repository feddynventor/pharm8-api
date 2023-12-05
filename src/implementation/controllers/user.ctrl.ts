import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"

import { UserPayload } from "../../core/entities/user"
import { IUserRepository } from "../../core/interfaces/user.iface"
import { NewUserParams, VerifyUserParams } from "../../core/schemas/user.schema"

export const verifyUser = (
    userRepository: IUserRepository,
    server: FastifyInstance
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
    .verifyUser( request.body as VerifyUserParams )
    .then(res => {
            const {uuid, ...rest} = res;
            if (res) reply.status(200)
                .send({ token: server.jwt.sign({
                    payload: {uuid},
                    user: rest
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
    reply.status(200).send({ ip: request.socket.remoteAddress, user: request.user})
}

export const createUser = (
    userRepository: IUserRepository,
    server: FastifyInstance
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
        .createUser( request.body as NewUserParams )
        .then(async (res) => {
            if (res) reply.status(200)
                .send({ token: server.jwt.sign({
                    payload: {uuid: res},
                    user: request.body as UserPayload
                }) })
            else
                reply.status(401)
            
        })
        .catch(err => {
            reply.status(400).send(err)
        })
}