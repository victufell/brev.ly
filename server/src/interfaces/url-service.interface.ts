import type { CreateUrlRequest } from '../types/index.js';

export interface Url {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListUrlsResponse {
  urls: Url[];
  total: number;
}

export interface CsvExportResponse {
  message: string;
  url: string;
  filename: string;
}

export interface IUrlService {
  createUrl(data: CreateUrlRequest): Promise<Url>;
  getUrlByShortUrl(shortUrl: string): Promise<Url | null>;
  deleteUrl(id: string): Promise<boolean>;
  listUrls(page: number, limit: number): Promise<ListUrlsResponse>;
  incrementAccessCount(id: string): Promise<void>;
  exportToCsv(): Promise<CsvExportResponse>;
}
