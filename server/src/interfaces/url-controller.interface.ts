import type { FastifyRequest, FastifyReply } from 'fastify';

export interface IUrlController {
  createUrl(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  redirectToOriginal(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  getUrl(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  deleteUrl(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  listUrls(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
  exportToCsv(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply>;
}
