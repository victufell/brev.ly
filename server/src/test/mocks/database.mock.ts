import { vi } from 'vitest';
import type { Url } from '../../interfaces/url-service.interface.js';

export const mockUrls: Url[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    originalUrl: 'https://example.com/very-long-url',
    shortUrl: 'abc123',
    accessCount: 5,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    originalUrl: 'https://google.com',
    shortUrl: 'google',
    accessCount: 10,
    createdAt: new Date('2024-01-02T10:00:00Z'),
    updatedAt: new Date('2024-01-02T10:00:00Z'),
  },
];

export const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  offset: vi.fn(),
  orderBy: vi.fn(),
  values: vi.fn(),
  set: vi.fn(),
  returning: vi.fn(),
};

// Chain methods for Drizzle-like syntax
mockDb.select.mockReturnValue(mockDb);
mockDb.insert.mockReturnValue(mockDb);
mockDb.update.mockReturnValue(mockDb);
mockDb.delete.mockReturnValue(mockDb);
mockDb.from.mockReturnValue(mockDb);
mockDb.where.mockReturnValue(mockDb);
mockDb.limit.mockReturnValue(mockDb);
mockDb.offset.mockReturnValue(mockDb);
mockDb.orderBy.mockReturnValue(mockDb);
mockDb.values.mockReturnValue(mockDb);
mockDb.set.mockReturnValue(mockDb);
mockDb.returning.mockReturnValue(mockDb);
