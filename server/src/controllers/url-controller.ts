import type { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { UrlService } from '../services/url-service.js';
import { createUrlSchema, getUrlSchema, deleteUrlSchema } from '../types/index.js';

export class UrlController {
  static async createUrl(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const validatedData = createUrlSchema.parse(request.body);
      
      const url = await UrlService.createUrl(validatedData);
      
      return reply.status(201).send({
        url,
        message: 'URL encurtada criada com sucesso',
      });
    } catch (error) {
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
      
      if (error instanceof Error) {
        return reply.status(400).send({
          error: error.message,
        });
      }
      
      return reply.status(500).send({
        error: 'Erro interno do servidor',
      });
    }
  }

  static async redirectToOriginal(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const params = request.params as { shortUrl: string };
      const { shortUrl } = params;
      
      const url = await UrlService.getUrlByShortUrl(shortUrl);
      
      if (!url) {
        return reply.status(404).send({
          error: 'URL encurtada não encontrada',
        });
      }

      await UrlService.incrementAccessCount(url.id);
      
      return reply.redirect(url.originalUrl);
    } catch (error) {
      return reply.status(500).send({
        error: 'Erro interno do servidor',
      });
    }
  }

  static async getUrl(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const validatedParams = getUrlSchema.parse(request.params);
      const { shortUrl } = validatedParams;
      
      const url = await UrlService.getUrlByShortUrl(shortUrl);
      
      if (!url) {
        return reply.status(404).send({
          error: 'URL encurtada não encontrada',
        });
      }
      
      return reply.send({ url });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        return reply.status(400).send({
          error: 'Parâmetros inválidos',
          validation: validationErrors,
        });
      }
      
      return reply.status(500).send({
        error: 'Erro interno do servidor',
      });
    }
  }

  static async deleteUrl(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const validatedParams = deleteUrlSchema.parse(request.params);
      const { id } = validatedParams;
      
      const deleted = await UrlService.deleteUrl(id);
      
      if (!deleted) {
        return reply.status(404).send({
          error: 'URL não encontrada',
        });
      }
      
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        return reply.status(400).send({
          error: 'Parâmetros inválidos',
          validation: validationErrors,
        });
      }
      
      return reply.status(500).send({
        error: 'Erro interno do servidor',
      });
    }
  }

  static async listUrls(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const querystring = request.query as { page?: string; limit?: string };
      const page = parseInt(querystring.page || '1');
      const limit = parseInt(querystring.limit || '10');
      
      const result = await UrlService.listUrls(page, limit);
      
      return reply.send(result);
    } catch (error) {
      return reply.status(500).send({
        error: 'Erro interno do servidor',
      });
    }
  }

  static async exportToCsv(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const result = await UrlService.exportToCsv();
      
      return reply.send({
        message: 'CSV exportado com sucesso',
        ...result,
      });
    } catch (error) {
      return reply.status(500).send({
        error: 'Erro interno do servidor',
      });
    }
  }
} 