import fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify'
import { FastifyJwtNamespace } from '@fastify/jwt'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import docs from './helpers/docs'

import { userRoutes } from './routes/user.route'
import { authRoutes } from './routes/auth.route'
import { farmaciaRoutes } from './routes/farmacia.route'

import { UserRepository } from './repositories/user.repo'
import { FarmaciaRepository } from './repositories/farmacia.repo'

export const createServer = async (basePath: string): Promise<FastifyInstance> => {

    const server = fastify().withTypeProvider<JsonSchemaToTsProvider>()
  
    await server.register(docs)
    await server.register(require('@fastify/jwt'), {
      secret: 'nonsihamailapappapronta987324'
    })
  
    const userRepository = new UserRepository()
    authRoutes(userRepository, server).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.route(route);
          next();
        }, { prefix: basePath+'/auth' });
    });
    userRoutes(userRepository).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.addHook('onRequest', (request) => request.jwtVerify())
          fastify.route(route);
          next();
        }, { prefix: basePath+'/users' });
    });

    const farmaciaRepository = new FarmaciaRepository()
    farmaciaRoutes(farmaciaRepository).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.addHook('onRequest', (request) => request.jwtVerify())
          fastify.route(route);
          next();
        }, { prefix: basePath+'/farmacie' });
    });

    await server.ready()
    return server
}