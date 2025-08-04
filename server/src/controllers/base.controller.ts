import type { FastifyReply } from 'fastify';

export abstract class BaseController {
  protected success<T>(reply: FastifyReply, data: T, statusCode: number = 200) {
    return reply.status(statusCode).send(data);
  }

  protected created<T>(reply: FastifyReply, data: T, message?: string) {
    return reply.status(201).send({
      ...data,
      ...(message && { message }),
    });
  }

  protected noContent(reply: FastifyReply) {
    return reply.status(204).send();
  }

  protected notFound(reply: FastifyReply, message: string = 'Recurso não encontrado') {
    return reply.status(404).send({ error: message });
  }
}
