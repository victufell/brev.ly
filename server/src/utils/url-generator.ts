import { nanoid } from 'nanoid';
import { db } from '../database/connection.js';
import { urls } from '../database/schema.js';
import { eq } from 'drizzle-orm';

export class UrlGenerator {
  private static readonly SHORT_URL_LENGTH = 8;
  private static readonly MAX_ATTEMPTS = 10;

  static async generateUniqueShortUrl(): Promise<string> {
    let attempts = 0;
    
    while (attempts < this.MAX_ATTEMPTS) {
      const shortUrl = nanoid(this.SHORT_URL_LENGTH);
      
      const existingUrl = await db
        .select()
        .from(urls)
        .where(eq(urls.shortUrl, shortUrl))
        .limit(1);
      
      if (existingUrl.length === 0) {
        return shortUrl;
      }
      
      attempts++;
    }
    
    throw new Error('Não foi possível gerar uma URL encurtada única após várias tentativas');
  }

  static async isShortUrlAvailable(shortUrl: string): Promise<boolean> {
    const existingUrl = await db
      .select()
      .from(urls)
      .where(eq(urls.shortUrl, shortUrl))
      .limit(1);
    
    return existingUrl.length === 0;
  }
} 