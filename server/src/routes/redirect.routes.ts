import type { FastifyInstance } from 'fastify';
import { Container } from '../container/container.js';
import type { IUrlController } from '../interfaces/url-controller.interface.js';
import { urlSchemas } from '../schemas/url.schema.js';
import { getUrlSchema } from '../types/index.js';
import { validateParams } from '../middlewares/validation.middleware.js';

export async function redirectRoutes(fastify: FastifyInstance) {
  const container = Container.getInstance();
  const urlController = container.resolve<IUrlController>('UrlController');

  fastify.get('/:shortUrl', {
    schema: urlSchemas.redirect,
    preHandler: validateParams(getUrlSchema),
  }, async (request, reply) => {
    return urlController.redirectToOriginal(request, reply);
  });
}