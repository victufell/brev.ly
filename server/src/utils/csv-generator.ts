import type { Url } from '../database/schema.js';

export class CsvGenerator {
  static generateCsvContent(urls: Url[]): string {
    const headers = ['URL Original', 'URL Encurtada', 'Contagem de Acessos', 'Data de Criação'];
    const rows = urls.map(url => [
      url.originalUrl,
      url.shortUrl,
      url.accessCount.toString(),
      url.createdAt.toISOString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  }

  static generateUniqueFilename(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `urls-export-${timestamp}-${randomSuffix}.csv`;
  }
} 