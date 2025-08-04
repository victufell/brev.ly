import type { FastifyRequest, FastifyReply } from 'fastify';
import { BaseController } from './base.controller.js';
import type { IUrlService } from '../interfaces/url-service.interface.js';
import type { IUrlController } from '../interfaces/url-controller.interface.js';
import type { 
  CreateUrlDto, 
  GetUrlParamsDto, 
  DeleteUrlParamsDto, 
  ListUrlsDto 
} from '../dto/url.dto.js';

export class UrlController extends BaseController implements IUrlController {
  constructor(private readonly urlService: IUrlService) {
    super();
  }

  async createUrl(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const data = request.body as CreateUrlDto;
    const url = await this.urlService.createUrl(data);
    
    return this.created(reply, { url }, 'URL encurtada criada com sucesso');
  }

  async redirectToOriginal(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { shortUrl } = request.params as GetUrlParamsDto;
    
    const url = await this.urlService.getUrlByShortUrl(shortUrl);
    
    if (!url) {
      return this.notFound(reply, 'URL encurtada não encontrada');
    }

    await this.urlService.incrementAccessCount(url.id);
    
    return reply.redirect(url.originalUrl);
  }

  async getUrl(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { shortUrl } = request.params as GetUrlParamsDto;
    
    const url = await this.urlService.getUrlByShortUrl(shortUrl);
    
    if (!url) {
      return this.notFound(reply, 'URL encurtada não encontrada');
    }
    
    return this.success(reply, { url });
  }

  async deleteUrl(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { id } = request.params as DeleteUrlParamsDto;
    
    const deleted = await this.urlService.deleteUrl(id);
    
    if (!deleted) {
      return this.notFound(reply, 'URL não encontrada');
    }
    
    return this.noContent(reply);
  }

  async listUrls(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const query = request.query as ListUrlsDto;
    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '10'), 100); // Máximo 100 itens
    
    const result = await this.urlService.listUrls(page, limit);
    
    return this.success(reply, result);
  }

  async exportToCsv(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const result = await this.urlService.exportToCsv();
    
    return this.success(reply, result);
  }
}