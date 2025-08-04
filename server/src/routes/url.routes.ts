import type { FastifyInstance } from 'fastify';
import { Container } from '../container/container.js';
import type { IUrlController } from '../interfaces/url-controller.interface.js';
import { urlSchemas } from '../schemas/url.schema.js';
import { createUrlSchema, getUrlSchema, deleteUrlSchema } from '../types/index.js';
import { validateBody, validateParams } from '../middlewares/validation.middleware.js';

export async function urlRoutes(fastify: FastifyInstance) {
  const container = Container.getInstance();
  const urlController = container.resolve<IUrlController>('UrlController');

  fastify.post('/urls', {
    schema: urlSchemas.createUrl,
    preHandler: validateBody(createUrlSchema),
  }, async (request, reply) => {
    return urlController.createUrl(request, reply);
  });

  fastify.get('/urls/:shortUrl', {
    schema: urlSchemas.getUrl,
    preHandler: validateParams(getUrlSchema),
  }, async (request, reply) => {
    return urlController.getUrl(request, reply);
  });

  fastify.delete('/urls/:id', {
    schema: urlSchemas.deleteUrl,
    preHandler: validateParams(deleteUrlSchema),
  }, async (request, reply) => {
    return urlController.deleteUrl(request, reply);
  });

  fastify.get('/urls', {
    schema: urlSchemas.listUrls,
  }, async (request, reply) => {
    return urlController.listUrls(request, reply);
  });

  fastify.get('/urls/export/csv', {
    schema: urlSchemas.exportCsv,
  }, async (request, reply) => {
    return urlController.exportToCsv(request, reply);
  });
}