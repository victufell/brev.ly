# Fastify

## Motivação

O Fastify foi escolhido como framework web principal devido à sua performance excepcional, baixo overhead e excelente suporte a TypeScript, sendo ideal para APIs de alta performance como o Brev.ly.

## Benefícios

### 1. Performance Superior
- **Velocidade**: Um dos frameworks Node.js mais rápidos disponíveis
- **Baixo overhead**: Menor uso de memória e CPU
- **Throughput alto**: Capaz de lidar com muitas requisições simultâneas
- **Latência baixa**: Resposta rápida para operações de encurtamento de URLs

### 2. TypeScript First
- **Tipagem nativa**: Suporte completo a TypeScript
- **Type inference**: Inferência automática de tipos
- **Plugin ecosystem**: Plugins tipados disponíveis
- **Schema validation**: Validação de schemas com tipos

### 3. Plugin Architecture
- **Modularidade**: Sistema de plugins extensível
- **CORS**: Suporte nativo para CORS
- **Validation**: Validação automática de requests
- **Serialization**: Serialização otimizada de responses

### 4. Developer Experience
- **Logging**: Sistema de logging integrado
- **Error handling**: Tratamento de erros robusto
- **Hot reload**: Suporte a desenvolvimento com hot reload
- **Documentation**: Auto-geração de documentação OpenAPI

## Configuração no Projeto

```typescript
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

await fastify.register(cors, {
  origin: true,
  credentials: true,
});
```

## Exemplos de Uso

### Rota com Validação
```typescript
fastify.post('/urls', {
  schema: {
    body: createUrlSchema,
    response: {
      201: {
        type: 'object',
        properties: {
          url: { type: 'object' },
          message: { type: 'string' },
        },
      },
    },
  },
}, UrlController.createUrl);
```

### Tratamento de Erros Global
```typescript
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  if (error.validation) {
    return reply.status(400).send({
      error: 'Dados inválidos',
      details: error.validation,
    });
  }
  
  return reply.status(500).send({
    error: 'Erro interno do servidor',
  });
});
```

## Plugins Utilizados

- **@fastify/cors**: Configuração de CORS
- **@fastify/multipart**: Upload de arquivos
- **@fastify/static**: Servir arquivos estáticos

## Performance Benchmarks

Comparação com outros frameworks (req/sec):
- **Fastify**: ~30,000
- **Express**: ~15,000
- **Koa**: ~20,000
- **Hapi**: ~25,000

## Considerações

- **Ecosystem**: Menor que Express, mas crescente
- **Learning curve**: Conceitos específicos do Fastify
- **Plugin compatibility**: Verificar compatibilidade de plugins

## Alternativas Consideradas

- **Express**: Mais popular, mas menos performático
- **Koa**: Moderno, mas menos plugins
- **Hapi**: Robusto, mas mais complexo
- **NestJS**: Framework completo, mas mais pesado 