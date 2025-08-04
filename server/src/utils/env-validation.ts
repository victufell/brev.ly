import { z } from 'zod';

// Schema de validação para variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3333'),
  
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL deve ser uma URL válida'),
  
  // CORS (obrigatório em produção)
  ALLOWED_ORIGINS: z.string().optional().refine((val) => {
    if (process.env.NODE_ENV === 'production' && (!val || val.trim() === '')) {
      return false;
    }
    return true;
  }, 'ALLOWED_ORIGINS é obrigatório em produção'),
  
  // Cloudflare R2 (obrigatório para funcionalidade de CSV)
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1, 'CLOUDFLARE_ACCOUNT_ID é obrigatório'),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1, 'CLOUDFLARE_ACCESS_KEY_ID é obrigatório'),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1, 'CLOUDFLARE_SECRET_ACCESS_KEY é obrigatório'),
  CLOUDFLARE_BUCKET: z.string().min(1, 'CLOUDFLARE_BUCKET é obrigatório'),
  CLOUDFLARE_PUBLIC_URL: z.string().url('CLOUDFLARE_PUBLIC_URL deve ser uma URL válida'),
  
  // Rate Limiting (opcional)
  RATE_LIMIT_GLOBAL: z.string().regex(/^\d+$/).transform(Number).optional(),
  RATE_LIMIT_CREATE_URLS: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  try {
    const env = envSchema.parse(process.env);
    
    // Validações adicionais para produção
    if (env.NODE_ENV === 'production') {
      // Verificar se DATABASE_URL usa SSL
      if (!env.DATABASE_URL.includes('ssl=') && !env.DATABASE_URL.includes('sslmode=')) {
        console.warn('⚠️  AVISO: DATABASE_URL não especifica SSL em produção');
      }
      
      // Verificar configurações de segurança
      if (!env.ALLOWED_ORIGINS) {
        throw new Error('ALLOWED_ORIGINS é obrigatório em produção');
      }
      
      console.log('✅ Configurações de ambiente validadas para PRODUÇÃO');
    } else {
      console.log('✅ Configurações de ambiente validadas para DESENVOLVIMENTO');
    }
    
    return env;
  } catch (error) {
    console.error('❌ Erro na validação das variáveis de ambiente:');
    
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error(`  - ${error}`);
    }
    
    console.error('\n📋 Verifique o arquivo env.example para referência');
    process.exit(1);
  }
} 