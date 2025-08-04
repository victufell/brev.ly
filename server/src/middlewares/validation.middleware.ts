import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../errors/app-error.js';

export function validateBody(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      request.body = schema.parse(request.body);
      done();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new ValidationError('Dados inválidos').cause = { validation: validationErrors };
      }
      done(error as Error);
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      request.params = schema.parse(request.params);
      done();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new ValidationError('Parâmetros inválidos').cause = { validation: validationErrors };
      }
      done(error as Error);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
      request.query = schema.parse(request.query);
      done();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new ValidationError('Parâmetros de consulta inválidos').cause = { validation: validationErrors };
      }
      done(error as Error);
    }
  };
}
