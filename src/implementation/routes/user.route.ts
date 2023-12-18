import { type RouteOptions } from 'fastify'

import { IUserRepository } from '../../core/interfaces/user.iface'

import { updateUser, deleteUser, whoami, removeFarmaciaPreferita } from '../controllers/user.ctrl'
import { UpdateUserSchema } from '../../core/schemas/user.schema'

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
  },
  {
    method: 'POST',
    url: '/edit',
    schema: UpdateUserSchema,
    handler: updateUser(userRepository)
  },{
    method: 'DELETE',
    url: '/',
    schema: {
      description: "Elimina utente loggato",
      tags: ["user"],
      security: [{ Bearer: [] }],
    },
    handler: deleteUser(userRepository)
  },{
    method: 'DELETE',
    url: '/edit',
    schema: {
      description: "Rimuovi farmacia preferita",
      tags: ["user"],
      security: [{ Bearer: [] }],
    },
    handler: removeFarmaciaPreferita(userRepository)
  }
])
