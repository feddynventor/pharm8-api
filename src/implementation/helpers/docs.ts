import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginOptions, type FastifyPluginAsync } from 'fastify'
import fastifySwagger, { type FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import fastifySwaggerUi, { type FastifySwaggerUiOptions } from '@fastify/swagger-ui'

const docsPlugin: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {
  const openApiOptions: FastifyDynamicSwaggerOptions = {
    openapi: {
      info: {
        title: 'fastify-postgres',
        description: 'REST API gateway for PostgreSQL',
        version: '1.0.0'
      },
      components: {
        securitySchemes: {
          Bearer: {
            type: 'http',
            scheme: 'bearer'
          }
        }
      }
    },
    hideUntagged: true
  }

  await server.register(fastifySwagger, openApiOptions)

  const openApiUiOptions: FastifySwaggerUiOptions = {
    routePrefix: options.prefix,
    initOAuth: {},
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next()
      },
      preHandler: function (request, reply, next) {
        next()
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  }

  await server.register(fastifySwaggerUi, openApiUiOptions)
}

export default fp(docsPlugin)
