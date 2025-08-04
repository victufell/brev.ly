import { vi } from 'vitest';
import type { IUrlService, Url, ListUrlsResponse, CsvExportResponse } from '../../interfaces/url-service.interface.js';
import type { CreateUrlRequest } from '../../types/index.js';
import { mockUrls } from './database.mock.js';

export const createMockUrlService = (): IUrlService => ({
  createUrl: vi.fn().mockImplementation(async (data: CreateUrlRequest): Promise<Url> => {
    const newUrl: Url = {
      id: '123e4567-e89b-12d3-a456-426614174002',
      originalUrl: data.originalUrl,
      shortUrl: data.shortUrl || 'generated',
      accessCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newUrl;
  }),

  getUrlByShortUrl: vi.fn().mockImplementation(async (shortUrl: string): Promise<Url | null> => {
    return mockUrls.find(url => url.shortUrl === shortUrl) || null;
  }),

  deleteUrl: vi.fn().mockImplementation(async (id: string): Promise<boolean> => {
    return mockUrls.some(url => url.id === id);
  }),

  listUrls: vi.fn().mockImplementation(async (page: number = 1, limit: number = 10): Promise<ListUrlsResponse> => {
    const start = (page - 1) * limit;
    const end = start + limit;
    const urls = mockUrls.slice(start, end);
    
    return {
      urls,
      total: mockUrls.length,
    };
  }),

  incrementAccessCount: vi.fn().mockResolvedValue(undefined),

  exportToCsv: vi.fn().mockImplementation(async (): Promise<CsvExportResponse> => {
    return {
      message: 'CSV exportado com sucesso',
      url: 'https://cdn.example.com/file.csv',
      filename: 'urls-export-123456.csv',
    };
  }),
});
