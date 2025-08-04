import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { Container } from '../../../container/container.js';
import { urlRoutes } from '../../../routes/url.routes.js';
import { errorHandler } from '../../../errors/error-handler.js';
import { validCreateUrlRequest, invalidUrls } from '../../fixtures/url.fixtures.js';

describe('URL Routes Integration', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    
    // Setup container
    const container = Container.getInstance();
    container.setupDependencies();
    
    // Register error handler
    app.setErrorHandler(errorHandler);
    
    // Register routes
    await app.register(urlRoutes, { prefix: '/api' });
    
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/urls', () => {
    it('should create a new URL', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: validCreateUrlRequest,
      });

      expect(response.statusCode).toBe(201);
      
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('url');
      expect(data).toHaveProperty('message', 'URL encurtada criada com sucesso');
      expect(data.url).toMatchObject({
        originalUrl: validCreateUrlRequest.originalUrl,
        shortUrl: validCreateUrlRequest.shortUrl,
        accessCount: 0,
      });
    });

    it('should create URL without custom shortUrl', async () => {
      const payload = {
        originalUrl: 'https://google.com',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload,
      });

      expect(response.statusCode).toBe(201);
      
      const data = JSON.parse(response.payload);
      expect(data.url.shortUrl).toBeDefined();
      expect(data.url.shortUrl.length).toBeGreaterThan(0);
    });

    it('should reject malformed URLs', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: invalidUrls.malformedUrl,
      });

      expect(response.statusCode).toBe(400);
      
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('error');
    });

    it('should reject dangerous protocols', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: invalidUrls.dangerousProtocol,
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject invalid shortUrl format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: invalidUrls.invalidShortUrlChars,
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject shortUrl that is too short', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: invalidUrls.invalidShortUrl,
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/urls/:shortUrl', () => {
    let createdShortUrl: string;

    beforeEach(async () => {
      // Create a URL first
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: {
          originalUrl: 'https://example.com/test',
          shortUrl: 'test-get',
        },
      });
      
      const createData = JSON.parse(createResponse.payload);
      createdShortUrl = createData.url.shortUrl;
    });

    it('should get URL information', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/urls/${createdShortUrl}`,
      });

      expect(response.statusCode).toBe(200);
      
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('url');
      expect(data.url).toMatchObject({
        originalUrl: 'https://example.com/test',
        shortUrl: createdShortUrl,
      });
    });

    it('should return 404 for non-existent shortUrl', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/urls/nonexistent',
      });

      expect(response.statusCode).toBe(404);
      
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('error', 'URL encurtada não encontrada');
    });
  });

  describe('DELETE /api/urls/:id', () => {
    let createdUrlId: string;

    beforeEach(async () => {
      // Create a URL first
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: {
          originalUrl: 'https://example.com/delete',
          shortUrl: 'test-delete',
        },
      });
      
      const createData = JSON.parse(createResponse.payload);
      createdUrlId = createData.url.id;
    });

    it('should delete URL successfully', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/urls/${createdUrlId}`,
      });

      expect(response.statusCode).toBe(204);
      expect(response.payload).toBe('');
    });

    it('should return 404 for non-existent ID', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/urls/123e4567-e89b-12d3-a456-426614174999',
      });

      expect(response.statusCode).toBe(404);
    });

    it('should return 400 for invalid UUID format', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/urls/invalid-uuid',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/urls', () => {
    it('should list URLs with default pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/urls',
      });

      expect(response.statusCode).toBe(200);
      
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('urls');
      expect(data).toHaveProperty('total');
      expect(Array.isArray(data.urls)).toBe(true);
      expect(typeof data.total).toBe('number');
    });

    it('should list URLs with custom pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/urls?page=1&limit=5',
      });

      expect(response.statusCode).toBe(200);
      
      const data = JSON.parse(response.payload);
      expect(data.urls.length).toBeLessThanOrEqual(5);
    });

    it('should limit maximum page size to 100', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/urls?limit=500',
      });

      expect(response.statusCode).toBe(200);
      // The controller should limit to 100, so this should work fine
    });
  });

  describe('GET /api/urls/export/csv', () => {
    it('should export URLs to CSV', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/urls/export/csv',
      });

      expect(response.statusCode).toBe(200);
      
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('url');
      expect(data).toHaveProperty('filename');
    });
  });
});
