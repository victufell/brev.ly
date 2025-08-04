# Nanoid

## Motivação

O Nanoid foi escolhido como biblioteca de geração de IDs únicos devido à sua performance superior, tamanho compacto e geração de IDs seguros e únicos, sendo ideal para criar URLs encurtadas que precisam ser únicas e difíceis de adivinhar.

## Benefícios

### 1. Performance Superior
- **Velocidade**: 60% mais rápido que UUID
- **Baixo overhead**: Menor uso de CPU e memória
- **Geração síncrona**: Sem operações assíncronas desnecessárias
- **Otimização**: Algoritmo otimizado para performance

### 2. Segurança
- **Criptograficamente seguro**: Usa `crypto.randomBytes()` quando disponível
- **Imprevisível**: IDs difíceis de adivinhar
- **Colisão resistente**: Probabilidade extremamente baixa de colisões
- **URL-safe**: Caracteres seguros para URLs

### 3. Flexibilidade
- **Tamanho customizável**: IDs de qualquer tamanho
- **Alfabeto customizável**: Caracteres personalizados
- **URL-friendly**: Caracteres seguros por padrão
- **Legível**: IDs legíveis e memorizáveis

### 4. Tamanho Compacto
- **Bundle size**: Apenas 130 bytes (gzipped)
- **Zero dependencies**: Sem dependências externas
- **Tree shaking**: Compatível com tree shaking
- **ESM support**: Suporte completo a módulos ES

## Configuração no Projeto

```typescript
import { nanoid } from 'nanoid';

export class UrlGenerator {
  private static readonly SHORT_URL_LENGTH = 8;
  private static readonly MAX_ATTEMPTS = 10;

  static async generateUniqueShortUrl(): Promise<string> {
    let attempts = 0;
    
    while (attempts < this.MAX_ATTEMPTS) {
      const shortUrl = nanoid(this.SHORT_URL_LENGTH);
      
      // Verificar se já existe
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
}
```

## Exemplos de Uso

### Geração Básica
```typescript
import { nanoid } from 'nanoid';

// ID padrão (21 caracteres)
const id = nanoid(); // "V1StGXR8_Z5jdHi6B-myT"

// ID customizado (8 caracteres)
const shortId = nanoid(8); // "bG9mKp2x"

// ID para URL (10 caracteres)
const urlId = nanoid(10); // "IRFa-VaY2b"
```

### Alfabeto Customizado
```typescript
import { customAlphabet } from 'nanoid';

// Apenas números
const numericId = customAlphabet('0123456789', 6);
const id = numericId(); // "123456"

// Apenas letras minúsculas
const alphaId = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);
const id = alphaId(); // "abcdefgh"

// Alfabeto personalizado
const customId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
const id = customId(); // "ABCDEF"
```

### Geração com Verificação de Unicidade
```typescript
static async generateUniqueShortUrl(): Promise<string> {
  const maxAttempts = 10;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const shortUrl = nanoid(8);
    
    // Verificar se já existe no banco
    const exists = await this.isShortUrlExists(shortUrl);
    
    if (!exists) {
      return shortUrl;
    }
    
    attempts++;
  }
  
  throw new Error('Não foi possível gerar ID único após várias tentativas');
}
```

## Características dos IDs Gerados

### Formato Padrão
- **Tamanho**: 21 caracteres (padrão)
- **Alfabeto**: A-Z, a-z, 0-9, _-
- **Entropia**: 126 bits
- **Colisões**: 1 em 2^126

### URLs Encurtadas
- **Tamanho**: 8 caracteres
- **Alfabeto**: A-Z, a-z, 0-9, _-
- **Entropia**: 48 bits
- **Colisões**: 1 em 2^48

## Comparação de Performance

### Benchmarks (IDs gerados/segundo)
- **Nanoid**: ~2,000,000
- **UUID v4**: ~1,200,000
- **Crypto.randomUUID()**: ~1,500,000
- **Math.random()**: ~3,000,000 (menos seguro)

### Tamanho de Bundle
- **Nanoid**: 130 bytes (gzipped)
- **UUID**: 435 bytes (gzipped)
- **Crypto**: 0 bytes (nativo)

## Segurança

### Características de Segurança
- **Criptográfico**: Usa `crypto.randomBytes()` quando disponível
- **Fallback**: Fallback para `Math.random()` em ambientes limitados
- **Imprevisível**: Não pode ser adivinhado
- **Único**: Probabilidade extremamente baixa de duplicação

### Probabilidade de Colisões
```typescript
// Para 8 caracteres (48 bits)
// 1 milhão de IDs: 1 em 281,474,976,710,656
// 1 bilhão de IDs: 1 em 281,474,976
// 1 trilhão de IDs: 1 em 281,474

// Para 21 caracteres (126 bits)
// Praticamente impossível de colidir
```

## Otimizações Implementadas

### 1. Tamanho Otimizado
```typescript
// 8 caracteres para URLs encurtadas
// Equilibra legibilidade e unicidade
private static readonly SHORT_URL_LENGTH = 8;
```

### 2. Verificação de Unicidade
```typescript
// Verificar no banco antes de usar
static async isShortUrlAvailable(shortUrl: string): Promise<boolean> {
  const existingUrl = await db
    .select()
    .from(urls)
    .where(eq(urls.shortUrl, shortUrl))
    .limit(1);
  
  return existingUrl.length === 0;
}
```

### 3. Retry Logic
```typescript
// Tentar várias vezes em caso de colisão
let attempts = 0;
while (attempts < this.MAX_ATTEMPTS) {
  const shortUrl = nanoid(this.SHORT_URL_LENGTH);
  // ... verificar e retornar se único
  attempts++;
}
```

## Considerações

- **Tamanho vs Unicidade**: Trade-off entre legibilidade e unicidade
- **Verificação de banco**: Necessário verificar unicidade no banco
- **Performance**: Muito rápido, mas verificação de banco pode ser bottleneck

## Alternativas Consideradas

- **UUID v4**: Mais longo, menos legível
- **Crypto.randomUUID()**: Nativo, mas menos flexível
- **Math.random()**: Mais rápido, mas menos seguro
- **Shortid**: Similar, mas menos popular 