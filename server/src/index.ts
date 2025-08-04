import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from 'dotenv';
import { apiRoutes, redirectRoutes } from './routes/url-routes.js';
import { validateEnv } from './utils/env-validation.js';
import type { FastifyRequest } from 'fastify';

config();
const env = validateEnv();

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

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

if (process.env.NODE_ENV !== 'production') {
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

await fastify.register(cors, {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'])
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

await fastify.register(redirectRoutes);

await fastify.register(apiRoutes, { prefix: '/api' });

fastify.get('/health', {
  schema: process.env.NODE_ENV !== 'production' ? {
    tags: ['Health'],
    summary: 'Verificação de saúde da aplicação',
    description: 'Endpoint para verificar se a aplicação está funcionando corretamente',
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  } : undefined,
}, async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  if (process.env.NODE_ENV === 'production') {
    if (error.statusCode && error.statusCode < 500) {
      return reply.status(error.statusCode).send({
        error: error.message,
      });
    }
    
    return reply.status(500).send({
      error: 'Erro interno do servidor',
    });
  }
  
  if (error.validation) {
    return reply.status(400).send({
      error: 'Dados inválidos',
      details: error.validation,
    });
  }
  
  return reply.status(error.statusCode || 500).send({
    error: error.message || 'Erro interno do servidor',
    stack: error.stack,
  });
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3333');
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    await fastify.listen({ port, host });
    
    console.log(`🚀 Servidor rodando em http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
    console.log(`🔗 API: http://${host}:${port}/api`);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📚 Documentação: http://${host}:${port}/docs`);
    }
    
    console.log(`↩️  Redirecionamento: http://${host}:${port}/SHORTURL`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 