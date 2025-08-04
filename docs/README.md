# Documentação Técnica - Brev.ly

Esta pasta contém a documentação técnica detalhada sobre as tecnologias utilizadas no projeto Brev.ly, incluindo motivações, benefícios e decisões arquiteturais.

## Índice

- [TypeScript](./typescript.md) - Linguagem de programação
- [Fastify](./fastify.md) - Framework web
- [Drizzle ORM](./drizzle-orm.md) - ORM para PostgreSQL
- [PostgreSQL](./postgresql.md) - Banco de dados
- [Cloudflare R2](./cloudflare-r2.md) - Armazenamento de arquivos
- [Zod](./zod.md) - Validação de dados
- [Nanoid](./nanoid.md) - Geração de IDs únicos
- [Vitest](./vitest.md) - Framework de testes
- [ESLint & Prettier](./linting-formatting.md) - Qualidade de código
- [Docker](./docker.md) - Containerização
- [pnpm](./pnpm.md) - Gerenciador de pacotes
- [Swagger/OpenAPI](./swagger.md) - Documentação da API

## Visão Geral

O projeto Brev.ly foi desenvolvido seguindo as melhores práticas modernas de desenvolvimento Node.js, priorizando:

- **Performance**: Fastify como framework web de alta performance
- **Type Safety**: TypeScript para detecção de erros em tempo de compilação
- **Produtividade**: Drizzle ORM para desenvolvimento ágil com banco de dados
- **Escalabilidade**: PostgreSQL como banco de dados robusto e escalável
- **Confiabilidade**: Zod para validação de dados em runtime
- **Segurança**: Nanoid para geração de IDs únicos e seguros
- **Qualidade**: ESLint e Prettier para padronização de código
- **Testabilidade**: Vitest para testes unitários e de integração
- **Deploy**: Docker para containerização e deploy consistente
- **Documentação**: Swagger/OpenAPI para documentação automática da API

Cada tecnologia foi escolhida após análise cuidadosa de suas características, comunidade ativa, performance e adequação aos requisitos do projeto. 