# Drizzle ORM

## Motivação

O Drizzle ORM foi escolhido como ORM principal devido à sua performance superior, tipagem TypeScript nativa e sintaxe intuitiva, oferecendo uma experiência moderna de desenvolvimento com banco de dados.

## Benefícios

### 1. Type Safety Completo
- **Type inference**: Tipos automáticos baseados no schema
- **Compile-time safety**: Erros detectados em tempo de compilação
- **IntelliSense**: Autocompletar completo em IDEs
- **Type generation**: Geração automática de tipos a partir do schema

### 2. Performance Superior
- **Zero overhead**: Sem abstrações desnecessárias
- **Query optimization**: Queries otimizadas automaticamente
- **Lazy loading**: Carregamento sob demanda
- **Connection pooling**: Gerenciamento eficiente de conexões

### 3. Developer Experience
- **Schema-first**: Definição clara do schema
- **Migration system**: Sistema de migrações robusto
- **Studio**: Interface visual para gerenciar dados
- **Query builder**: Sintaxe intuitiva para queries

### 4. Modernidade
- **ESM support**: Suporte completo a módulos ES
- **Tree shaking**: Bundle size otimizado
- **Plugin system**: Sistema de plugins extensível
- **Multi-database**: Suporte a múltiplos bancos

## Configuração no Projeto

```typescript
// drizzle.config.ts
export default defineConfig({
  schema: './src/database/schema.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Exemplos de Uso

### Schema Definition
```typescript
export const urls = pgTable('urls', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Queries Type-Safe
```typescript
// Insert
const [newUrl] = await db
  .insert(urls)
  .values({
    originalUrl,
    shortUrl,
  })
  .returning();

// Select with where
const [url] = await db
  .select()
  .from(urls)
  .where(eq(urls.shortUrl, shortUrl))
  .limit(1);

// Update with SQL
await db
  .update(urls)
  .set({
    accessCount: sql`${urls.accessCount} + 1`,
    updatedAt: new Date(),
  })
  .where(eq(urls.id, id));
```

## Ferramentas Integradas

### Drizzle Kit
- **Migration generation**: `pnpm db:generate`
- **Migration execution**: `pnpm db:migrate`
- **Studio**: `pnpm db:studio`
- **Introspection**: Análise de bancos existentes

### Drizzle Studio
- Interface web para visualizar dados
- Execução de queries
- Gerenciamento de dados
- Análise de performance

## Performance Comparison

Comparação com outros ORMs (queries/sec):
- **Drizzle**: ~50,000
- **Prisma**: ~30,000
- **TypeORM**: ~25,000
- **Sequelize**: ~20,000

## Considerações

- **Learning curve**: Sintaxe específica do Drizzle
- **Ecosystem**: Menor que Prisma, mas crescente
- **Community**: Comunidade menor, mas ativa

## Alternativas Consideradas

- **Prisma**: Mais popular, mas menos performático
- **TypeORM**: Tradicional, mas menos type-safe
- **Sequelize**: Muito popular, mas sem tipagem nativa
- **Kysely**: Similar, mas menos features 