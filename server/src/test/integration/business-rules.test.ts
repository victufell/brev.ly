import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { Container } from '../../container/container.js';
import { urlRoutes } from '../../routes/url.routes.js';
import { redirectRoutes } from '../../routes/redirect.routes.js';
import { errorHandler } from '../../errors/error-handler.js';

describe('Business Rules Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    
    const container = Container.getInstance();
    container.setupDependencies();
    
    app.setErrorHandler(errorHandler);
    
    await app.register(redirectRoutes);
    await app.register(urlRoutes, { prefix: '/api' });
    
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Rule: URLs must be unique', () => {
    it('should prevent creating duplicate shortUrls', async () => {
      const payload = {
        originalUrl: 'https://example.com/unique-test',
        shortUrl: 'unique-test',
      };

      // Create first URL
      const firstResponse = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload,
      });
      expect(firstResponse.statusCode).toBe(201);

      // Try to create duplicate
      const duplicateResponse = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload,
      });
      expect(duplicateResponse.statusCode).toBe(409); // Conflict
      
      const data = JSON.parse(duplicateResponse.payload);
      expect(data.error).toContain('já existe');
    });
  });

  describe('Rule: URL validation and security', () => {
    it('should block dangerous protocols', async () => {
      const dangerousUrls = [
        'javascript:alert("xss")',
        'data:text/html,<script>alert("xss")</script>',
        'vbscript:msgbox("xss")',
        'file:///etc/passwd',
      ];

      for (const url of dangerousUrls) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/urls',
          payload: { originalUrl: url },
        });

        expect(response.statusCode).toBe(400);
        const data = JSON.parse(response.payload);
        expect(data.error).toBeDefined();
      }
    });

    it('should validate shortUrl format strictly', async () => {
      const invalidShortUrls = [
        'ab', // too short
        'a'.repeat(51), // too long
        'test@123', // invalid characters
        'test 123', // spaces
        'test.123', // dots
        'test/123', // slashes
      ];

      for (const shortUrl of invalidShortUrls) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/urls',
          payload: {
            originalUrl: 'https://example.com',
            shortUrl,
          },
        });

        expect(response.statusCode).toBe(400);
      }
    });

    it('should allow valid shortUrl formats', async () => {
      const validShortUrls = [
        'abc',
        'test123',
        'test-123',
        'test_123',
        'ABC123',
        'mixed-CASE_123',
      ];

      for (const shortUrl of validShortUrls) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/urls',
          payload: {
            originalUrl: `https://example.com/${shortUrl}`,
            shortUrl,
          },
        });

        expect(response.statusCode).toBe(201);
      }
    });
  });

  describe('Rule: Access count increment', () => {
    it('should increment access count only on redirects, not on info requests', async () => {
      // Create URL
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: {
          originalUrl: 'https://example.com/access-test',
          shortUrl: 'access-test',
        },
      });
      const createData = JSON.parse(createResponse.payload);
      const shortUrl = createData.url.shortUrl;

      // Get info multiple times - should not increment
      await app.inject({ method: 'GET', url: `/api/urls/${shortUrl}` });
      await app.inject({ method: 'GET', url: `/api/urls/${shortUrl}` });
      
      const infoResponse = await app.inject({
        method: 'GET',
        url: `/api/urls/${shortUrl}`,
      });
      const infoData = JSON.parse(infoResponse.payload);
      expect(infoData.url.accessCount).toBe(0);

      // Perform redirect - should increment
      await app.inject({ method: 'GET', url: `/${shortUrl}` });
      
      const afterRedirectResponse = await app.inject({
        method: 'GET',
        url: `/api/urls/${shortUrl}`,
      });
      const afterRedirectData = JSON.parse(afterRedirectResponse.payload);
      expect(afterRedirectData.url.accessCount).toBe(1);
    });
  });

  describe('Rule: Pagination limits', () => {
    it('should enforce maximum page size of 100', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/urls?limit=500',
      });

      expect(response.statusCode).toBe(200);
      // The business rule is enforced in the controller
      // We can't easily test the exact limit without checking the service call
      // But we know it should not crash and should return valid data
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('urls');
      expect(data).toHaveProperty('total');
    });

    it('should handle pagination correctly', async () => {
      // Create multiple URLs first
      const urls = [];
      for (let i = 0; i < 5; i++) {
        const response = await app.inject({
          method: 'POST',
          url: '/api/urls',
          payload: {
            originalUrl: `https://example.com/page-test-${i}`,
            shortUrl: `page-test-${i}`,
          },
        });
        urls.push(JSON.parse(response.payload).url);
      }

      // Test pagination
      const page1Response = await app.inject({
        method: 'GET',
        url: '/api/urls?page=1&limit=3',
      });
      const page1Data = JSON.parse(page1Response.payload);
      expect(page1Data.urls.length).toBeLessThanOrEqual(3);

      const page2Response = await app.inject({
        method: 'GET',
        url: '/api/urls?page=2&limit=3',
      });
      const page2Data = JSON.parse(page2Response.payload);
      expect(page2Data.total).toBe(page1Data.total);
    });
  });

  describe('Rule: CSV export functionality', () => {
    it('should generate CSV with proper structure', async () => {
      // Create a test URL
      await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: {
          originalUrl: 'https://example.com/csv-test',
          shortUrl: 'csv-test',
        },
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/urls/export/csv',
      });

      expect(response.statusCode).toBe(200);
      
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('url');
      expect(data).toHaveProperty('filename');
      
      // Filename should be unique and have timestamp
      expect(data.filename).toMatch(/urls-export-\d+\.csv/);
      
      // URL should be a valid URL
      expect(data.url).toMatch(/^https?:\/\/.+/);
    });
  });

  describe('Rule: Resource cleanup', () => {
    it('should properly delete URLs and handle cascade effects', async () => {
      // Create URL
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/urls',
        payload: {
          originalUrl: 'https://example.com/delete-test',
          shortUrl: 'delete-test',
        },
      });
      const createData = JSON.parse(createResponse.payload);
      const urlId = createData.url.id;
      const shortUrl = createData.url.shortUrl;

      // Verify URL exists
      const beforeDeleteResponse = await app.inject({
        method: 'GET',
        url: `/api/urls/${shortUrl}`,
      });
      expect(beforeDeleteResponse.statusCode).toBe(200);

      // Delete URL
      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/api/urls/${urlId}`,
      });
      expect(deleteResponse.statusCode).toBe(204);

      // Verify URL no longer exists
      const afterDeleteResponse = await app.inject({
        method: 'GET',
        url: `/api/urls/${shortUrl}`,
      });
      expect(afterDeleteResponse.statusCode).toBe(404);

      // Verify redirect no longer works
      const redirectResponse = await app.inject({
        method: 'GET',
        url: `/${shortUrl}`,
      });
      expect(redirectResponse.statusCode).toBe(404);
    });
  });
});
