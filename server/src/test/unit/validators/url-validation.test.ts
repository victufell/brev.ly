import { describe, it, expect } from 'vitest';
import { createUrlSchema, getUrlSchema, deleteUrlSchema } from '../../../types/index.js';
import { invalidUrls } from '../../fixtures/url.fixtures.js';

describe('URL Validation', () => {
  describe('createUrlSchema', () => {
    it('should validate correct URL data', () => {
      const validData = {
        originalUrl: 'https://example.com/very-long-url',
        shortUrl: 'test123',
      };

      const result = createUrlSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should validate URL without shortUrl', () => {
      const validData = {
        originalUrl: 'https://example.com/very-long-url',
      };

      const result = createUrlSchema.parse(validData);
      expect(result).toEqual({
        originalUrl: validData.originalUrl,
        shortUrl: undefined,
      });
    });

    it('should reject malformed URLs', () => {
      expect(() => createUrlSchema.parse(invalidUrls.malformedUrl))
        .toThrow(/URL deve ser válida/);
    });

    it('should reject dangerous protocols', () => {
      expect(() => createUrlSchema.parse(invalidUrls.dangerousProtocol))
        .toThrow(/URL não é segura ou não é permitida/);
    });

    it('should reject localhost in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      expect(() => createUrlSchema.parse(invalidUrls.localhost))
        .toThrow(/URL não é segura ou não é permitida/);

      process.env.NODE_ENV = originalEnv;
    });

    it('should reject private IPs in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      expect(() => createUrlSchema.parse(invalidUrls.privateIp))
        .toThrow(/URL não é segura ou não é permitida/);

      process.env.NODE_ENV = originalEnv;
    });

    it('should reject short URLs that are too short', () => {
      expect(() => createUrlSchema.parse(invalidUrls.invalidShortUrl))
        .toThrow(/URL encurtada deve ter pelo menos 3 caracteres/);
    });

    it('should reject short URLs with invalid characters', () => {
      expect(() => createUrlSchema.parse(invalidUrls.invalidShortUrlChars))
        .toThrow(/URL encurtada deve conter apenas letras, números, _ e -/);
    });

    it('should handle empty string as undefined for shortUrl', () => {
      const data = {
        originalUrl: 'https://example.com',
        shortUrl: '',
      };

      const result = createUrlSchema.parse(data);
      expect(result.shortUrl).toBeUndefined();
    });
  });

  describe('getUrlSchema', () => {
    it('should validate shortUrl parameter', () => {
      const validData = { shortUrl: 'test123' };
      const result = getUrlSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject empty shortUrl', () => {
      expect(() => getUrlSchema.parse({ shortUrl: '' }))
        .toThrow(/URL encurtada é obrigatória/);
    });
  });

  describe('deleteUrlSchema', () => {
    it('should validate UUID parameter', () => {
      const validData = { id: '123e4567-e89b-12d3-a456-426614174000' };
      const result = deleteUrlSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject invalid UUID', () => {
      expect(() => deleteUrlSchema.parse({ id: 'invalid-uuid' }))
        .toThrow(/ID deve ser um UUID válido/);
    });
  });
});
