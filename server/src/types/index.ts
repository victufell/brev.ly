import { z } from 'zod';

// Lista de protocolos e domínios perigosos
const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:', 'ftp:'];
const LOCALHOST_PATTERNS = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];

// Validação personalizada para URLs seguras
const safeUrlValidation = z.string()
  .url('URL deve ser válida')
  .refine((url) => {
    try {
      const parsedUrl = new URL(url);
      
      // Bloquear protocolos perigosos
      if (DANGEROUS_PROTOCOLS.some(protocol => 
        parsedUrl.protocol.toLowerCase().startsWith(protocol)
      )) {
        return false;
      }
      
      // Permitir apenas HTTP e HTTPS
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return false;
      }
      
      // Bloquear localhost em produção
      if (process.env.NODE_ENV === 'production') {
        const hostname = parsedUrl.hostname.toLowerCase();
        if (LOCALHOST_PATTERNS.some(pattern => hostname.includes(pattern))) {
          return false;
        }
        
        // Bloquear IPs privados
        if (hostname.match(/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/)) {
          return false;
        }
      }
      
      return true;
    } catch {
      return false;
    }
  }, 'URL não é segura ou não é permitida');

// Schemas de validação
export const createUrlSchema = z.object({
  originalUrl: safeUrlValidation,
  shortUrl: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) {
        return undefined;
      }
      return val;
    },
    z.string()
      .min(3, 'URL encurtada deve ter pelo menos 3 caracteres')
      .max(50, 'URL encurtada deve ter no máximo 50 caracteres')
      .regex(/^[a-zA-Z0-9_-]+$/, 'URL encurtada deve conter apenas letras, números, _ e -')
      .optional()
  ),
});

export const updateUrlSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

export const deleteUrlSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
});

export const getUrlSchema = z.object({
  shortUrl: z.string().min(1, 'URL encurtada é obrigatória'),
});

// Tipos derivados dos schemas
export type CreateUrlRequest = z.infer<typeof createUrlSchema>;
export type UpdateUrlInput = z.infer<typeof updateUrlSchema>;
export type DeleteUrlInput = z.infer<typeof deleteUrlSchema>;
export type GetUrlInput = z.infer<typeof getUrlSchema>;

// Tipos de resposta
export interface UrlResponse {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUrlResponse {
  url: UrlResponse;
  message: string;
}

export interface ListUrlsResponse {
  urls: UrlResponse[];
  total: number;
}

export interface CsvExportResponse {
  url: string;
  filename: string;
} 