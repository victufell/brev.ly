import { describe, it, expect } from 'vitest';
import { CsvGenerator } from '../../../utils/csv-generator.js';

describe('CsvGenerator', () => {
  describe('generateCsvContent', () => {
    it('should generate CSV with headers', () => {
      const urls = [
        {
          id: '1',
          originalUrl: 'https://example.com',
          shortUrl: 'test123',
          accessCount: 5,
          createdAt: new Date('2024-01-01T10:00:00Z'),
        },
        {
          id: '2',
          originalUrl: 'https://google.com',
          shortUrl: 'google',
          accessCount: 10,
          createdAt: new Date('2024-01-02T10:00:00Z'),
        },
      ];

      const csv = CsvGenerator.generateCsvContent(urls);

      expect(csv).toContain('URL Original,URL Encurtada,Contagem de Acessos,Data de Criação');
      expect(csv).toContain('https://example.com');
      expect(csv).toContain('test123');
      expect(csv).toContain('5');
      expect(csv).toContain('https://google.com');
      expect(csv).toContain('google');
      expect(csv).toContain('10');
    });

    it('should handle empty array', () => {
      const csv = CsvGenerator.generateCsvContent([]);

      expect(csv).toBe('URL Original,URL Encurtada,Contagem de Acessos,Data de Criação');
    });

    it('should escape commas in URLs', () => {
      const urls = [
        {
          id: '1',
          originalUrl: 'https://example.com/path?param1=value1,value2',
          shortUrl: 'test',
          accessCount: 1,
          createdAt: new Date('2024-01-01T10:00:00Z'),
        },
      ];

      const csv = CsvGenerator.generateCsvContent(urls);

      expect(csv).toContain('https://example.com/path?param1=value1,value2');
    });
  });

  describe('generateUniqueFilename', () => {
    it('should generate filename with timestamp', () => {
      const filename = CsvGenerator.generateUniqueFilename();

      expect(filename).toMatch(/^urls-export-.*\.csv$/);
    });

    it('should generate different filenames on consecutive calls', () => {
      const filename1 = CsvGenerator.generateUniqueFilename();
      const filename2 = CsvGenerator.generateUniqueFilename();

      expect(filename1).not.toBe(filename2);
    });
  });
});
