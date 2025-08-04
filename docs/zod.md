# Zod

## Motivação

O Zod foi escolhido como biblioteca de validação de dados devido à sua integração perfeita com TypeScript, sintaxe intuitiva e capacidade de inferir tipos automaticamente, proporcionando validação em runtime com type safety em compile time.

## Benefícios

### 1. TypeScript Integration
- **Type inference**: Inferência automática de tipos a partir de schemas
- **Compile-time safety**: Tipos gerados automaticamente
- **IntelliSense**: Autocompletar completo em IDEs
- **Type guards**: Guards de tipo automáticos

### 2. Validação Robusta
- **Runtime validation**: Validação em tempo de execução
- **Error messages**: Mensagens de erro customizáveis
- **Nested validation**: Validação de objetos aninhados
- **Custom validators**: Validadores customizados

### 3. Sintaxe Intuitiva
- **Chainable API**: API encadeável e fluente
- **Composable schemas**: Schemas composáveis
- **Transformations**: Transformações automáticas
- **Defaults**: Valores padrão automáticos

### 4. Performance
- **Zero dependencies**: Sem dependências externas
- **Tree shaking**: Bundle size otimizado
- **Lazy evaluation**: Avaliação preguiçosa
- **Caching**: Cache interno para performance

## Configuração no Projeto

```typescript
// Schemas de validação
export const createUrlSchema = z.object({
  originalUrl: z.string().url('URL deve ser válida'),
  shortUrl: z.string().min(3, 'URL encurtada deve ter pelo menos 3 caracteres').optional(),
});

export const getUrlSchema = z.object({
  shortUrl: z.string().min(1, 'URL encurtada é obrigatória'),
});
```

## Exemplos de Uso

### Validação Básica
```typescript
// Schema simples
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18),
});

// Validação
const user = userSchema.parse({
  name: "João",
  email: "joao@example.com",
  age: 25,
});
```

### Validação com Transformações
```typescript
const urlSchema = z.object({
  originalUrl: z.string()
    .url('URL deve ser válida')
    .transform(url => url.toLowerCase()),
  shortUrl: z.string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9-_]+$/, 'Apenas letras, números, hífen e underscore')
    .optional(),
});
```

### Validação de Parâmetros
```typescript
const paginationSchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Página deve ser um número')
    .transform(Number)
    .pipe(z.number().min(1)),
  limit: z.string()
    .regex(/^\d+$/, 'Limite deve ser um número')
    .transform(Number)
    .pipe(z.number().min(1).max(100)),
});
```

## Integração com Fastify

### Schema de Rota
```typescript
fastify.post('/urls', {
  schema: {
    body: createUrlSchema,
    response: {
      201: {
        type: 'object',
        properties: {
          url: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              originalUrl: { type: 'string' },
              shortUrl: { type: 'string' },
              accessCount: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
          message: { type: 'string' },
        },
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
}, UrlController.createUrl);
```

### Validação no Controller
```typescript
static async createUrl(
  request: FastifyRequest<{ Body: CreateUrlInput }>,
  reply: FastifyReply
) {
  try {
    // Validação automática pelo Fastify + Zod
    const url = await UrlService.createUrl(request.body);
    
    return reply.status(201).send({
      url,
      message: 'URL encurtada criada com sucesso',
    });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({
        error: error.message,
      });
    }
    
    return reply.status(500).send({
      error: 'Erro interno do servidor',
    });
  }
}
```

## Tipos Derivados

### Inferência de Tipos
```typescript
// Tipos derivados dos schemas
export type CreateUrlInput = z.infer<typeof createUrlSchema>;
export type GetUrlInput = z.infer<typeof getUrlSchema>;
export type DeleteUrlInput = z.infer<typeof deleteUrlSchema>;

// Interfaces de resposta
export interface UrlResponse {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Validação Customizada

### Validadores Customizados
```typescript
const customUrlSchema = z.object({
  originalUrl: z.string()
    .url('URL deve ser válida')
    .refine(
      (url) => !url.includes('localhost'),
      'URLs locais não são permitidas'
    ),
  shortUrl: z.string()
    .min(3)
    .max(20)
    .refine(
      (shortUrl) => /^[a-zA-Z0-9-_]+$/.test(shortUrl),
      'Apenas letras, números, hífen e underscore'
    )
    .optional(),
});
```

### Validação Condicional
```typescript
const conditionalSchema = z.object({
  type: z.enum(['custom', 'auto']),
  shortUrl: z.string().optional(),
}).refine(
  (data) => {
    if (data.type === 'custom') {
      return data.shortUrl && data.shortUrl.length >= 3;
    }
    return true;
  },
  {
    message: 'URL encurtada é obrigatória para tipo custom',
    path: ['shortUrl'],
  }
);
```

## Tratamento de Erros

### Error Handling
```typescript
try {
  const validatedData = schema.parse(input);
  // Dados válidos
} catch (error) {
  if (error instanceof z.ZodError) {
    // Erros de validação
    console.log(error.errors);
    // [
    //   {
    //     code: "invalid_string",
    //     message: "URL deve ser válida",
    //     path: ["originalUrl"]
    //   }
    // ]
  }
}
```

## Performance

### Benchmarks
Comparação com outras bibliotecas (validações/sec):
- **Zod**: ~50,000
- **Joi**: ~30,000
- **Yup**: ~25,000
- **Ajv**: ~40,000

## Considerações

- **Bundle size**: ~12KB gzipped
- **Learning curve**: Sintaxe específica
- **Error messages**: Customização de mensagens

## Alternativas Consideradas

- **Joi**: Popular, mas sem TypeScript nativo
- **Yup**: Similar, mas menos performático
- **Ajv**: Mais rápido, mas menos intuitivo
- **io-ts**: Funcional, mas mais complexo 