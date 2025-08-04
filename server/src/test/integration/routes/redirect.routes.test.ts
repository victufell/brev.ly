import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { Container } from '../../../container/container.js';
import { redirectRoutes } from '../../../routes/redirect.routes.js';
import { urlRoutes } from '../../../routes/url.routes.js';
import { errorHandler } from '../../../errors/error-handler.js';

describe('Redirect Routes Integration', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    
    // Setup container
    const container = Container.getInstance();
    container.setupDependencies();
    
    // Register error handler
    app.setErrorHandler(errorHandler);
    
    // Register both redirect and url routes
    await app.register(redirectRoutes);
    await app.register(urlRoutes, { prefix: '/api' });
    
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /:shortUrl', () => {
    let createdShortUrl: string;

    beforeEach(async () => {
      // Create a URL first
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: {
          originalUrl: 'https://example.com/redirect-test',
          shortUrl: 'redirect-test',
        },
      });
      
      const createData = JSON.parse(createResponse.payload);
      createdShortUrl = createData.url.shortUrl;
    });

    it('should redirect to original URL', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/${createdShortUrl}`,
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('https://example.com/redirect-test');
    });

    it('should increment access count on redirect', async () => {
      // First, get the initial access count
      const initialResponse = await app.inject({
        method: 'GET',
        url: `/api/urls/${createdShortUrl}`,
      });
      const initialData = JSON.parse(initialResponse.payload);
      const initialCount = initialData.url.accessCount;

      // Perform redirect
      await app.inject({
        method: 'GET',
        url: `/${createdShortUrl}`,
      });

      // Check if access count was incremented
      const afterResponse = await app.inject({
        method: 'GET',
        url: `/api/urls/${createdShortUrl}`,
      });
      const afterData = JSON.parse(afterResponse.payload);
      
      expect(afterData.url.accessCount).toBe(initialCount + 1);
    });

    it('should return 404 for non-existent shortUrl', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/nonexistent-short-url',
      });

      expect(response.statusCode).toBe(404);
      
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('error', 'URL encurtada não encontrada');
    });

    it('should handle multiple redirects correctly', async () => {
      // Perform multiple redirects
      await app.inject({ method: 'GET', url: `/${createdShortUrl}` });
      await app.inject({ method: 'GET', url: `/${createdShortUrl}` });
      await app.inject({ method: 'GET', url: `/${createdShortUrl}` });

      // Check final access count
      const response = await app.inject({
        method: 'GET',
        url: `/api/urls/${createdShortUrl}`,
      });
      const data = JSON.parse(response.payload);
      
      // Should have incremented by 3 (plus any previous increments)
      expect(data.url.accessCount).toBeGreaterThanOrEqual(3);
    });
  });
});
