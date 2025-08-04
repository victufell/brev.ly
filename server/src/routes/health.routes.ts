import type { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
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
}
