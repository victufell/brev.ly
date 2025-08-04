# PostgreSQL

## Motivação

O PostgreSQL foi escolhido como banco de dados principal devido à sua robustez, confiabilidade e recursos avançados, sendo ideal para aplicações que requerem consistência de dados e escalabilidade.

## Benefícios

### 1. Confiabilidade e ACID
- **ACID compliance**: Garantia de atomicidade, consistência, isolamento e durabilidade
- **Data integrity**: Integridade referencial robusta
- **Crash recovery**: Recuperação automática após falhas
- **Point-in-time recovery**: Recuperação para pontos específicos no tempo

### 2. Performance Superior
- **Query optimization**: Otimizador de queries avançado
- **Indexing**: Múltiplos tipos de índices (B-tree, Hash, GiST, etc.)
- **Parallel processing**: Processamento paralelo de queries
- **Connection pooling**: Suporte nativo a pool de conexões

### 3. Recursos Avançados
- **JSON support**: Suporte nativo a JSON/JSONB
- **Full-text search**: Busca em texto completo integrada
- **Geographic data**: Suporte a dados geoespaciais (PostGIS)
- **Extensions**: Sistema extensível de plugins

### 4. Escalabilidade
- **Horizontal scaling**: Replicação e sharding
- **Vertical scaling**: Otimização para hardware
- **Partitioning**: Particionamento de tabelas
- **Materialized views**: Views materializadas para performance

## Configuração no Projeto

```typescript
// Conexão com Drizzle
const client = postgres(connectionString, { 
  prepare: false,
  max: 10, // connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client);
```

## Schema Design

### Tabela URLs
```sql
CREATE TABLE urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_url TEXT NOT NULL,
  short_url TEXT NOT NULL UNIQUE,
  access_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Índices para performance
CREATE INDEX idx_urls_short_url ON urls(short_url);
CREATE INDEX idx_urls_created_at ON urls(created_at);
CREATE INDEX idx_urls_access_count ON urls(access_count);
```

## Otimizações Implementadas

### 1. Índices Estratégicos
- **short_url**: Para busca rápida de URLs encurtadas
- **created_at**: Para ordenação e paginação
- **access_count**: Para relatórios de popularidade

### 2. Constraints
- **UNIQUE**: Garantir URLs encurtadas únicas
- **NOT NULL**: Campos obrigatórios
- **CHECK**: Validações de domínio

### 3. Performance
- **Connection pooling**: Reutilização de conexões
- **Prepared statements**: Queries preparadas
- **Batch operations**: Operações em lote

## Monitoramento e Manutenção

### 1. Logs
```sql
-- Configurar logs de queries lentas
ALTER SYSTEM SET log_min_duration_statement = 1000;
ALTER SYSTEM SET log_statement = 'all';
```

### 2. Vacuum e Analyze
```sql
-- Manutenção automática
VACUUM ANALYZE urls;
```

### 3. Performance Views
```sql
-- Monitorar performance
SELECT * FROM pg_stat_user_tables WHERE schemaname = 'public';
```

## Backup e Recuperação

### 1. Backup Completo
```bash
pg_dump -h localhost -U username -d brevly > backup.sql
```

### 2. Backup Incremental
```bash
pg_dump -h localhost -U username -d brevly --data-only > data_backup.sql
```

### 3. Restore
```bash
psql -h localhost -U username -d brevly < backup.sql
```

## Considerações de Segurança

### 1. Autenticação
- **SSL/TLS**: Conexões criptografadas
- **Role-based access**: Controle de acesso por roles
- **Password policies**: Políticas de senha

### 2. Dados Sensíveis
- **Encryption at rest**: Criptografia de dados em repouso
- **Column-level security**: Segurança por coluna
- **Row-level security**: Segurança por linha

## Alternativas Consideradas

- **MySQL**: Popular, mas menos recursos avançados
- **SQLite**: Simples, mas não escalável
- **MongoDB**: NoSQL, mas sem ACID completo
- **Redis**: Cache, mas não persistente 