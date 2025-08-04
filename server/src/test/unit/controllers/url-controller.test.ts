import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { UrlController } from '../../../controllers/url-controller.js';
import { createMockUrlService } from '../../mocks/url-service.mock.js';
import { validCreateUrlRequest, validPaginationParams } from '../../fixtures/url.fixtures.js';
import type { IUrlService } from '../../../interfaces/url-service.interface.js';

describe('UrlController', () => {
  let urlController: UrlController;
  let mockUrlService: IUrlService;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockUrlService = createMockUrlService();
    urlController = new UrlController(mockUrlService);

    mockRequest = {
      body: {},
      params: {},
      query: {},
    };

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      redirect: vi.fn().mockReturnThis(),
    };
  });

  describe('createUrl', () => {
    it('should create URL successfully', async () => {
      mockRequest.body = validCreateUrlRequest;

      const mockUrl = {
        id: 'test-id',
        originalUrl: validCreateUrlRequest.originalUrl,
        shortUrl: validCreateUrlRequest.shortUrl!,
        accessCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockUrlService.createUrl).mockResolvedValue(mockUrl);

      await urlController.createUrl(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        url: mockUrl,
        message: 'URL encurtada criada com sucesso',
      });
    });
  });

  describe('redirectToOriginal', () => {
    it('should redirect to original URL and increment access count', async () => {
      mockRequest.params = { shortUrl: 'test123' };

      const mockUrl = {
        id: 'test-id',
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockUrlService.getUrlByShortUrl).mockResolvedValue(mockUrl);

      await urlController.redirectToOriginal(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUrlService.getUrlByShortUrl).toHaveBeenCalledWith('test123');
      expect(mockUrlService.incrementAccessCount).toHaveBeenCalledWith('test-id');
      expect(mockReply.redirect).toHaveBeenCalledWith('https://example.com');
    });

    it('should return 404 when URL not found', async () => {
      mockRequest.params = { shortUrl: 'nonexistent' };

      vi.mocked(mockUrlService.getUrlByShortUrl).mockResolvedValue(null);

      await urlController.redirectToOriginal(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'URL encurtada não encontrada',
      });
    });
  });

  describe('getUrl', () => {
    it('should return URL information', async () => {
      mockRequest.params = { shortUrl: 'test123' };

      const mockUrl = {
        id: 'test-id',
        originalUrl: 'https://example.com',
        shortUrl: 'test123',
        accessCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockUrlService.getUrlByShortUrl).mockResolvedValue(mockUrl);

      await urlController.getUrl(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.send).toHaveBeenCalledWith({ url: mockUrl });
    });

    it('should return 404 when URL not found', async () => {
      mockRequest.params = { shortUrl: 'nonexistent' };

      vi.mocked(mockUrlService.getUrlByShortUrl).mockResolvedValue(null);

      await urlController.getUrl(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'URL encurtada não encontrada',
      });
    });
  });

  describe('deleteUrl', () => {
    it('should delete URL successfully', async () => {
      mockRequest.params = { id: 'test-id' };

      vi.mocked(mockUrlService.deleteUrl).mockResolvedValue(true);

      await urlController.deleteUrl(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUrlService.deleteUrl).toHaveBeenCalledWith('test-id');
      expect(mockReply.status).toHaveBeenCalledWith(204);
      expect(mockReply.send).toHaveBeenCalledWith();
    });

    it('should return 404 when URL not found', async () => {
      mockRequest.params = { id: 'nonexistent' };

      vi.mocked(mockUrlService.deleteUrl).mockResolvedValue(false);

      await urlController.deleteUrl(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'URL não encontrada',
      });
    });
  });

  describe('listUrls', () => {
    it('should return paginated URLs list', async () => {
      mockRequest.query = validPaginationParams;

      const mockResponse = {
        urls: [
          {
            id: 'test-id-1',
            originalUrl: 'https://example1.com',
            shortUrl: 'test1',
            accessCount: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
      };

      vi.mocked(mockUrlService.listUrls).mockResolvedValue(mockResponse);

      await urlController.listUrls(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUrlService.listUrls).toHaveBeenCalledWith(1, 10);
      expect(mockReply.send).toHaveBeenCalledWith(mockResponse);
    });

    it('should use default pagination values', async () => {
      mockRequest.query = {};

      const mockResponse = {
        urls: [],
        total: 0,
      };

      vi.mocked(mockUrlService.listUrls).mockResolvedValue(mockResponse);

      await urlController.listUrls(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUrlService.listUrls).toHaveBeenCalledWith(1, 10);
    });

    it('should limit maximum page size to 100', async () => {
      mockRequest.query = { page: '1', limit: '500' };

      const mockResponse = { urls: [], total: 0 };
      vi.mocked(mockUrlService.listUrls).mockResolvedValue(mockResponse);

      await urlController.listUrls(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUrlService.listUrls).toHaveBeenCalledWith(1, 100);
    });
  });

  describe('exportToCsv', () => {
    it('should export URLs to CSV', async () => {
      const mockResponse = {
        message: 'CSV exportado com sucesso',
        url: 'https://cdn.example.com/file.csv',
        filename: 'urls-export-123456.csv',
      };

      vi.mocked(mockUrlService.exportToCsv).mockResolvedValue(mockResponse);

      await urlController.exportToCsv(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockUrlService.exportToCsv).toHaveBeenCalled();
      expect(mockReply.send).toHaveBeenCalledWith(mockResponse);
    });
  });
});
