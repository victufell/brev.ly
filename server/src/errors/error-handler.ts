import type { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { AppError, ValidationError } from './app-error.js';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);

  if (error instanceof ValidationError) {
    const response: any = { error: error.message };
    if (error.cause) {
      response.validation = error.cause;
    }
    return reply.status(error.statusCode).send(response);
  }

  if (error instanceof ZodError) {
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return reply.status(400).send({
      error: 'Dados inválidos',
      validation: validationErrors,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.message,
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      error: 'Dados inválidos',
      details: error.validation,
    });
  }

  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (isDevelopment) {
    return reply.status(error.statusCode || 500).send({
      error: error.message || 'Erro interno do servidor',
      stack: error.stack,
    });
  }

  if (error.statusCode && error.statusCode < 500) {
    return reply.status(error.statusCode).send({
      error: error.message,
    });
  }

  return reply.status(500).send({
    error: 'Erro interno do servidor',
  });
}