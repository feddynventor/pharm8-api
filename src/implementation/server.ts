import fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify'
import { FastifyJwtNamespace } from '@fastify/jwt'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import docs from './helpers/docs'

import { userRoutes } from './routes/user.route'
import { authRoutes } from './routes/auth.route'
import { farmaciaRoutes } from './routes/farmacia.route'
import { prodottiRoutes } from './routes/prodotto.route'
import { ordiniRoutes } from './routes/ordine.route'

import { UserRepository } from './repositories/user.repo'
import { FarmaciaRepository } from './repositories/farmacia.repo'
import { ProdottoRepository } from './repositories/prodotto.repo'
import { MagazzinoRepository } from './repositories/magazzino.repo'
import { OrdineRepository } from './repositories/ordine.repo'
import { User, UserToken } from '../core/entities/user'

export const createServer = async (basePath: string): Promise<FastifyInstance> => {

    const server = fastify().withTypeProvider<JsonSchemaToTsProvider>()

    await server.register(docs, { prefix: basePath+'/docs' })
    await server.register(require('@fastify/jwt'), {
      secret: 'nonsihamailapappapronta987324'
    })

    const unprotectedRoutes = ['/auth','/docs']

    const userRepository = new UserRepository()

    server.addHook('onRequest', (request, reply, next) => {
      const unproc = unprotectedRoutes.filter( route => {
        if (request.originalUrl.startsWith(basePath+route)) return route
      })
      if (unproc.length>0) {
        next()
        return;
      }
      console.log(unproc)

      request.jwtVerify()
      .then((jwt)=>{
        return (jwt as UserToken).payload.uuid
      })
      .then( userRepository.getUser )
      .then((res)=>{
        Object.assign(request.user, res)
        next()
      })
      .catch(err => {
        reply.status(401).send({message: "Token non valido"})
      })
    })
  
    authRoutes(userRepository, server).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.route(route);
          next();
        }, { prefix: basePath+'/auth' });
    });
    userRoutes(userRepository).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.route(route);
          next();
        }, { prefix: basePath+'/users' });
    });

    const farmaciaRepository = new FarmaciaRepository()
    const magazzinoRepository = new MagazzinoRepository()
    farmaciaRoutes(farmaciaRepository, magazzinoRepository).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.route(route);
          next();
        }, { prefix: basePath+'/farmacie' });
    });

    const prodottiRepository = new ProdottoRepository()
    prodottiRoutes(prodottiRepository, magazzinoRepository).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.route(route);
          next();
        }, { prefix: basePath+'/prodotti' });
    });

    const ordiniRepository = new OrdineRepository()
    ordiniRoutes(ordiniRepository).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.route(route);
          next();
        }, { prefix: basePath+'/ordine' });
    });

    await server.ready()
    return server
}