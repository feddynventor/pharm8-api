import { FastifyInstance, type RouteOptions } from 'fastify'

import { IUserRepository } from '../../core/interfaces/user.iface'

import { newUserSchema, verifyUserSchema } from '../../core/schemas/user.schema'
import { createUser, verifyUser } from '../controllers/user.ctrl'

export const authRoutes = (userRepository: IUserRepository, server: FastifyInstance): RouteOptions[] => ([
  {
    method: 'POST',
    url: '/login',
    schema: verifyUserSchema,
    handler: verifyUser(userRepository, server)
  },{
    method: 'POST',
    url: '/signup',
    schema: newUserSchema,
    handler: createUser(userRepository, server)
  }
])
