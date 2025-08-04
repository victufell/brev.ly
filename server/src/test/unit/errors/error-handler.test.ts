import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { errorHandler } from '../../../errors/error-handler.js';
import { AppError, ValidationError, NotFoundError, ConflictError } from '../../../errors/app-error.js';

describe('Error Handler', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockRequest = {
      log: {
        error: vi.fn(),
      } as any,
    };

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  it('should handle ValidationError correctly', () => {
    const error = new ValidationError('Dados inválidos');
    error.cause = { field: 'test', message: 'invalid' };

    errorHandler(error as any, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Dados inválidos',
      validation: { field: 'test', message: 'invalid' },
    });
  });

  it('should handle ZodError correctly', () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['originalUrl'],
        message: 'Expected string, received number',
      },
    ]);

    errorHandler(zodError as any, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Dados inválidos',
      validation: [
        {
          field: 'originalUrl',
          message: 'Expected string, received number',
        },
      ],
    });
  });

  it('should handle NotFoundError correctly', () => {
    const error = new NotFoundError('URL não encontrada');

    errorHandler(error as any, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(404);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'URL não encontrada',
    });
  });

  it('should handle ConflictError correctly', () => {
    const error = new ConflictError('URL já existe');

    errorHandler(error as any, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(409);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'URL já existe',
    });
  });

  it('should handle generic AppError correctly', () => {
    const error = new AppError('Erro customizado', 418);

    errorHandler(error as any, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(418);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Erro customizado',
    });
  });

  it('should handle Fastify validation errors', () => {
    const error = {
      validation: [{ field: 'test', message: 'invalid' }],
      statusCode: 400,
    };

    errorHandler(error as any, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Dados inválidos',
      details: [{ field: 'test', message: 'invalid' }],
    });
  });

  it('should handle unknown errors in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new Error('Unknown error');
    error.stack = 'stack trace';

    errorHandler(error as any, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Unknown error',
      stack: 'stack trace',
    });

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle unknown errors in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Internal error');

    errorHandler(error as any, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Erro interno do servidor',
    });

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle client errors in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = {
      statusCode: 400,
      message: 'Bad request',
    };

    errorHandler(error as any, mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      error: 'Bad request',
    });

    process.env.NODE_ENV = originalEnv;
  });
});
