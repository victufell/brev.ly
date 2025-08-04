# Vitest

## Motivação

O Vitest foi escolhido como framework de testes devido à sua integração nativa com Vite, velocidade superior e compatibilidade com Jest, oferecendo uma experiência de teste moderna e performática para o projeto Brev.ly.

## Benefícios

### 1. Performance Superior
- **Velocidade**: Até 20x mais rápido que Jest
- **Parallel execution**: Execução paralela de testes
- **Smart caching**: Cache inteligente de módulos
- **Watch mode**: Modo watch otimizado

### 2. Integração Nativa
- **Vite ecosystem**: Integração perfeita com Vite
- **TypeScript**: Suporte nativo a TypeScript
- **ESM**: Suporte completo a módulos ES
- **Config sharing**: Compartilhamento de configuração com Vite

### 3. Compatibilidade
- **Jest API**: API compatível com Jest
- **Migration**: Migração fácil de Jest
- **Familiar syntax**: Sintaxe familiar para desenvolvedores
- **Plugin ecosystem**: Ecossistema de plugins

### 4. Developer Experience
- **UI interface**: Interface visual para testes
- **Coverage**: Relatórios de cobertura integrados
- **Debugging**: Debugging avançado
- **Hot reload**: Recarregamento automático

## Configuração no Projeto

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

## Exemplos de Uso

### Teste Unitário
```typescript
import { describe, it, expect } from 'vitest';
import { UrlGenerator } from '../utils/url-generator';

describe('UrlGenerator', () => {
  it('should generate unique short URLs', async () => {
    const shortUrl1 = await UrlGenerator.generateUniqueShortUrl();
    const shortUrl2 = await UrlGenerator.generateUniqueShortUrl();
    
    expect(shortUrl1).toBeDefined();
    expect(shortUrl2).toBeDefined();
    expect(shortUrl1).not.toBe(shortUrl2);
    expect(shortUrl1).toHaveLength(8);
  });

  it('should check if short URL is available', async () => {
    const shortUrl = 'test123';
    const isAvailable = await UrlGenerator.isShortUrlAvailable(shortUrl);
    
    expect(typeof isAvailable).toBe('boolean');
  });
});
```

### Teste de Integração
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { UrlService } from '../services/url-service';
import { db } from '../database/connection';

describe('UrlService Integration', () => {
  beforeAll(async () => {
    // Setup do banco de teste
  });

  afterAll(async () => {
    // Cleanup do banco de teste
  });

  it('should create and retrieve URL', async () => {
    const urlData = {
      originalUrl: 'https://example.com/test',
      shortUrl: 'test123',
    };

    const createdUrl = await UrlService.createUrl(urlData);
    expect(createdUrl.originalUrl).toBe(urlData.originalUrl);
    expect(createdUrl.shortUrl).toBe(urlData.shortUrl);

    const retrievedUrl = await UrlService.getUrlByShortUrl(urlData.shortUrl);
    expect(retrievedUrl).toBeDefined();
    expect(retrievedUrl?.originalUrl).toBe(urlData.originalUrl);
  });
});
```

### Teste de API
```typescript
import { describe, it, expect } from 'vitest';
import { app } from '../index';

describe('API Endpoints', () => {
  it('should create URL via API', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/urls',
      payload: {
        originalUrl: 'https://example.com/test',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toHaveProperty('url');
  });

  it('should return 400 for invalid URL', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/urls',
      payload: {
        originalUrl: 'invalid-url',
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
```

## Configuração Avançada

### Setup de Teste
```typescript
// src/test/setup.ts
import { config } from 'dotenv';

// Carregar variáveis de ambiente para testes
config({ path: '.env.test' });

// Setup global para testes
global.beforeEach(() => {
  // Setup antes de cada teste
});

global.afterEach(() => {
  // Cleanup após cada teste
});
```

### Configuração de Coverage
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
      ],
    },
  },
});
```

## Scripts de Teste

### Package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

## UI Interface

### Vitest UI
```bash
pnpm test:ui
```

Características da UI:
- **Visual interface**: Interface visual para testes
- **Real-time updates**: Atualizações em tempo real
- **Filtering**: Filtros por status e nome
- **Coverage view**: Visualização de cobertura
- **Debugging**: Debugging integrado

## Performance Comparison

### Benchmarks (testes/segundo)
- **Vitest**: ~1,000
- **Jest**: ~50
- **Mocha**: ~200
- **Ava**: ~300

### Startup Time
- **Vitest**: ~100ms
- **Jest**: ~2,000ms
- **Mocha**: ~500ms

## Estratégias de Teste

### 1. Testes Unitários
```typescript
// Testar funções isoladas
describe('CsvGenerator', () => {
  it('should generate CSV content', () => {
    const urls = [
      { originalUrl: 'https://example.com', shortUrl: 'abc123', accessCount: 5, createdAt: new Date() }
    ];
    
    const csv = CsvGenerator.generateCsvContent(urls);
    expect(csv).toContain('https://example.com');
    expect(csv).toContain('abc123');
  });
});
```

### 2. Testes de Integração
```typescript
// Testar integração entre componentes
describe('UrlService Integration', () => {
  it('should handle full URL lifecycle', async () => {
    // Create
    const url = await UrlService.createUrl({ originalUrl: 'https://example.com' });
    
    // Read
    const retrieved = await UrlService.getUrlByShortUrl(url.shortUrl);
    
    // Update
    await UrlService.incrementAccessCount(url.id);
    
    // Delete
    const deleted = await UrlService.deleteUrl(url.id);
    
    expect(deleted).toBe(true);
  });
});
```

### 3. Testes E2E
```typescript
// Testar fluxo completo da aplicação
describe('URL Shortener E2E', () => {
  it('should shorten URL and redirect', async () => {
    // Criar URL
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/urls',
      payload: { originalUrl: 'https://example.com' },
    });
    
    const { shortUrl } = JSON.parse(createResponse.body).url;
    
    // Testar redirecionamento
    const redirectResponse = await app.inject({
      method: 'GET',
      url: `/${shortUrl}`,
    });
    
    expect(redirectResponse.statusCode).toBe(302);
  });
});
```

## Considerações

- **Learning curve**: Sintaxe similar ao Jest
- **Ecosystem**: Menor que Jest, mas crescente
- **Debugging**: Ferramentas avançadas de debugging

## Alternativas Consideradas

- **Jest**: Mais popular, mas mais lento
- **Mocha**: Tradicional, mas menos features
- **Ava**: Paralelo, mas menos popular
- **Jasmine**: Clássico, mas menos moderno 