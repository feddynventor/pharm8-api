import { type RouteOptions } from 'fastify'

import { IUserRepository } from '../../core/interfaces/user.iface'

import { whoami } from '../controllers/user.ctrl'

export const userRoutes = (userRepository: IUserRepository): RouteOptions[] => ([
  {
    method: 'GET',
    url: '/me',
    schema: {
      description: "Mostra dettagli utente loggato",
      tags: ["user"],
      security: [{ Bearer: [] }],
    },
    handler: whoami()
  }
])
