# Swagger/OpenAPI Documentation

## Motivação

O Swagger/OpenAPI foi integrado ao projeto para fornecer documentação automática e interativa da API, facilitando o desenvolvimento, testes e integração da API Brev.ly.

## Benefícios

### 1. Documentação Automática
- **Auto-generated docs**: Documentação gerada automaticamente dos schemas
- **Always up-to-date**: Documentação sempre atualizada com o código
- **Interactive**: Interface interativa para testar endpoints
- **Standard format**: Formato padrão OpenAPI 3.0

### 2. Developer Experience
- **API exploration**: Exploração fácil da API
- **Testing interface**: Interface para testar endpoints
- **Code generation**: Geração de código cliente
- **Contract-first**: Desenvolvimento orientado por contrato

### 3. Team Collaboration
- **Shared understanding**: Entendimento compartilhado da API
- **Frontend integration**: Facilita integração com frontend
- **API design**: Design colaborativo da API
- **Documentation**: Documentação viva e interativa

## Configuração no Projeto

### Plugins Instalados
```bash
pnpm add @fastify/swagger @fastify/swagger-ui
```

### Configuração Básica
```typescript
// Registrar plugin do Swagger
await fastify.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Brev.ly API',
      description: 'API para gerenciamento de encurtamento de URLs',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@brev.ly',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3333}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'URLs',
        description: 'Operações relacionadas ao encurtamento de URLs',
      },
      {
        name: 'Health',
        description: 'Verificação de saúde da aplicação',
      },
    ],
  },
});

// Registrar plugin do Swagger UI
await fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  staticCSP: true,
  transformSpecificationClone: true,
});
```

## Endpoints Documentados

### 1. Criar URL Encurtada
```http
POST /api/urls
```
- **Tag**: URLs
- **Summary**: Criar URL encurtada
- **Body**: JSON com originalUrl e shortUrl opcional

### 2. Redirecionar para URL Original
```http
GET /{shortUrl}
```
- **Tag**: URLs
- **Summary**: Redirecionar para URL original
- **Params**: shortUrl (string)

### 3. Obter Informações da URL
```http
GET /api/urls/{shortUrl}
```
- **Tag**: URLs
- **Summary**: Obter informações da URL
- **Params**: shortUrl (string)

### 4. Deletar URL
```http
DELETE /api/urls/{id}
```
- **Tag**: URLs
- **Summary**: Deletar URL
- **Params**: id (UUID)

### 5. Listar URLs
```http
GET /api/urls?page=1&limit=10
```
- **Tag**: URLs
- **Summary**: Listar URLs
- **Query**: page, limit

### 6. Exportar para CSV
```http
GET /api/urls/export/csv
```
- **Tag**: URLs
- **Summary**: Exportar URLs para CSV

### 7. Health Check
```http
GET /health
```
- **Tag**: Health
- **Summary**: Verificação de saúde da aplicação

## Schema Documentation

### Tipos Documentados
- **URL Response**: Objeto completo da URL
- **Create URL Input**: Dados para criar URL
- **Error Response**: Formato padrão de erro
- **Pagination**: Parâmetros de paginação

### Formatos Especiais
- **UUID**: IDs únicos
- **URI**: URLs válidas
- **Date-time**: Timestamps ISO

## Acesso à Documentação

### URLs de Acesso
- **Swagger UI**: `http://localhost:3333/docs`
- **OpenAPI JSON**: `http://localhost:3333/docs/json`
- **OpenAPI YAML**: `http://localhost:3333/docs/yaml`

### Funcionalidades da UI
- **Try it out**: Testar endpoints diretamente
- **Model examples**: Exemplos de request/response
- **Schema validation**: Validação de schemas
- **Authentication**: Suporte a autenticação (quando implementada)

## Exemplo de Schema

### Endpoint com Documentação Completa
```typescript
fastify.post('/urls', {
  schema: {
    tags: ['URLs'],
    summary: 'Criar URL encurtada',
    description: 'Cria uma nova URL encurtada a partir de uma URL original',
    body: zodToJsonSchema(createUrlSchema),
    response: {
      201: {
        type: 'object',
        description: 'URL encurtada criada com sucesso',
        properties: {
          url: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'ID único da URL' },
              originalUrl: { type: 'string', format: 'uri', description: 'URL original' },
              shortUrl: { type: 'string', description: 'URL encurtada' },
              accessCount: { type: 'number', description: 'Número de acessos' },
              createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
              updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização' },
            },
          },
          message: { type: 'string', description: 'Mensagem de sucesso' },
        },
      },
      400: {
        type: 'object',
        description: 'Erro de validação',
        properties: {
          error: { type: 'string', description: 'Mensagem de erro' },
        },
      },
    },
  },
}, UrlController.createUrl);
```

## Integração com Zod

### Conversão de Schemas
```typescript
import { zodToJsonSchema } from 'zod-to-json-schema';

// Converter schema Zod para JSON Schema
body: zodToJsonSchema(createUrlSchema),
params: zodToJsonSchema(getUrlSchema),
```

### Benefícios da Integração
- **Type safety**: Tipos seguros em desenvolvimento
- **Runtime validation**: Validação em runtime
- **Documentation sync**: Documentação sincronizada
- **Single source of truth**: Única fonte de verdade

## Configuração de Produção

### Desabilitar em Produção
```typescript
if (process.env.NODE_ENV !== 'production') {
  await fastify.register(swagger, { ... });
  await fastify.register(swaggerUi, { ... });
}
```

### Segurança
- **Authentication**: Adicionar autenticação se necessário
- **Rate limiting**: Implementar rate limiting
- **CORS**: Configurar CORS adequadamente

## Extensões Futuras

### 1. Autenticação
- **API Keys**: Documentar autenticação por API key
- **OAuth**: Implementar OAuth se necessário
- **JWT**: Documentar tokens JWT

### 2. Versionamento
- **API Versioning**: Documentar múltiplas versões
- **Deprecation**: Marcar endpoints deprecados
- **Migration guides**: Guias de migração

### 3. Exemplos Avançados
- **Request examples**: Exemplos de requisições
- **Response examples**: Exemplos de respostas
- **Error scenarios**: Cenários de erro

## Considerações

- **Performance**: Swagger UI pode adicionar overhead
- **Security**: Não expor em produção sem autenticação
- **Maintenance**: Manter documentação atualizada

## Alternativas Consideradas

- **Redoc**: Interface alternativa ao Swagger UI
- **Insomnia**: Cliente REST para testes
- **Postman**: Ferramenta popular para APIs
- **Custom docs**: Documentação customizada 