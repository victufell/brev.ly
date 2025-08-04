import { db } from '../database/connection.js';
import { urls } from '../database/schema.js';
import { eq, sql } from 'drizzle-orm';
import { UrlGenerator } from '../utils/url-generator.js';
import { CsvGenerator } from '../utils/csv-generator.js';
import { StorageService } from './storage-service.js';
import { NotFoundError, ConflictError } from '../errors/app-error.js';
import type { CreateUrlRequest } from '../types/index.js';
import type { IUrlService, Url, ListUrlsResponse, CsvExportResponse } from '../interfaces/url-service.interface.js';

export class UrlService implements IUrlService {
  async createUrl(data: CreateUrlRequest): Promise<Url> {
    const { originalUrl, shortUrl: customShortUrl } = data;

    if (customShortUrl) {
      const isAvailable = await UrlGenerator.isShortUrlAvailable(customShortUrl);
      if (!isAvailable) {
        throw new ConflictError('URL encurtada já existe');
      }
    }

    const shortUrl = customShortUrl || await UrlGenerator.generateUniqueShortUrl();

    const [newUrl] = await db
      .insert(urls)
      .values({
        originalUrl,
        shortUrl,
      })
      .returning();

    return {
      id: newUrl.id,
      originalUrl: newUrl.originalUrl,
      shortUrl: newUrl.shortUrl,
      accessCount: newUrl.accessCount,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
    };
  }

  async getUrlByShortUrl(shortUrl: string): Promise<Url | null> {
    const [url] = await db
      .select()
      .from(urls)
      .where(eq(urls.shortUrl, shortUrl))
      .limit(1);

    if (!url) return null;

    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      accessCount: url.accessCount,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  async incrementAccessCount(id: string): Promise<void> {
    await db
      .update(urls)
      .set({
        accessCount: sql`${urls.accessCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(urls.id, id));
  }

  async deleteUrl(id: string): Promise<boolean> {
    const [deletedUrl] = await db
      .delete(urls)
      .where(eq(urls.id, id))
      .returning();

    return !!deletedUrl;
  }

  async listUrls(page: number = 1, limit: number = 10): Promise<ListUrlsResponse> {
    const offset = (page - 1) * limit;

    const [urlsList, totalCount] = await Promise.all([
      db
        .select()
        .from(urls)
        .orderBy(urls.createdAt)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: urls.id })
        .from(urls)
        .then(result => result.length),
    ]);

    return {
      urls: urlsList.map(url => ({
        id: url.id,
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        accessCount: url.accessCount,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      })),
      total: totalCount,
    };
  }

  async exportToCsv(): Promise<CsvExportResponse> {
    const allUrls = await db
      .select()
      .from(urls)
      .orderBy(urls.createdAt);

    if (allUrls.length === 0) {
      throw new NotFoundError('Nenhuma URL encontrada para exportar');
    }

    const csvContent = CsvGenerator.generateCsvContent(allUrls);
    const filename = CsvGenerator.generateUniqueFilename();

    const publicUrl = await StorageService.uploadCsv(filename, csvContent);

    return {
      message: 'CSV exportado com sucesso',
      url: publicUrl,
      filename,
    };
  }
}