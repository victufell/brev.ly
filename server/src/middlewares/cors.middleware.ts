import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export async function registerCorsMiddleware(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: process.env.NODE_ENV === 'production' 
      ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'])
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}
