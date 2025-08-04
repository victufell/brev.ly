import type { CreateUrlRequest } from '../../types/index.js';

export const validCreateUrlRequest: CreateUrlRequest = {
  originalUrl: 'https://example.com/very-long-url',
  shortUrl: 'test123',
};

export const validCreateUrlRequestWithoutShort: CreateUrlRequest = {
  originalUrl: 'https://google.com',
};

export const invalidUrls = {
  malformedUrl: {
    originalUrl: 'not-a-url',
  },
  dangerousProtocol: {
    originalUrl: 'javascript:alert("xss")',
  },
  localhost: {
    originalUrl: 'http://localhost:3000',
  },
  privateIp: {
    originalUrl: 'http://192.168.1.1',
  },
  invalidShortUrl: {
    originalUrl: 'https://example.com',
    shortUrl: 'ab', // muito curto
  },
  invalidShortUrlChars: {
    originalUrl: 'https://example.com',
    shortUrl: 'test@123', // caracteres inválidos
  },
};

export const validPaginationParams = {
  page: '1',
  limit: '10',
};

export const invalidPaginationParams = {
  page: 'invalid',
  limit: 'abc',
};
