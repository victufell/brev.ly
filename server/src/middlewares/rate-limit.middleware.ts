import type { FastifyInstance, FastifyRequest } from 'fastify';
import rateLimit from '@fastify/rate-limit';

export async function registerGlobalRateLimit(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    max: process.env.NODE_ENV === 'production' ? 100 : 1000,
    timeWindow: '1 minute',
    errorResponseBuilder: function (request: FastifyRequest, context: any) {
      return {
        code: 429,
        error: 'Rate limit excedido',
        message: `Você pode fazer apenas ${context.max} requisições por ${context.timeWindow}`,
        expiresIn: Math.round(context.ttl / 1000),
      };
    },
  });
}

export async function registerUrlCreationRateLimit(fastify: FastifyInstance) {
  await fastify.register(async function (fastify) {
    await fastify.register(rateLimit, {
      max: process.env.NODE_ENV === 'production' ? 10 : 50,
      timeWindow: '1 hour',
      keyGenerator: (request: FastifyRequest) => {
        return request.ip;
      },
      skipOnError: false,
      errorResponseBuilder: function (request: FastifyRequest, context: any) {
        return {
          code: 429,
          error: 'Limite de criação de URLs excedido',
          message: `Você pode criar apenas ${context.max} URLs por hora`,
          expiresIn: Math.round(context.ttl / 1000),
        };
      },
    });
    
    fastify.addHook('preHandler', async (request: FastifyRequest) => {
      if (request.method === 'POST' && request.url.includes('/api/urls')) {
      }
    });
  });
}
