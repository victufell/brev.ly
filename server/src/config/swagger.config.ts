import type { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export async function registerSwagger(fastify: FastifyInstance) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Brev.ly API',
        description: 'API para gerenciamento de encurtamento de URLs',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'support@brev.ly',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3333}`,
          description: 'Development server',
        },
      ],
      tags: [
        {
          name: 'URLs',
          description: 'Operações relacionadas ao encurtamento de URLs',
        },
        {
          name: 'Redirect',
          description: 'Redirecionamento de URLs encurtadas',
        },
        {
          name: 'Health',
          description: 'Verificação de saúde da aplicação',
        },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next(); },
      preHandler: function (request, reply, next) { next(); },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
}
