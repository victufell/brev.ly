# 🔒 **Guia de Segurança e Performance - Produção**

## 🚨 **Checklist de Segurança - OBRIGATÓRIO**

### ✅ **Já Implementado**

#### **1. Rate Limiting**
- ✅ Rate limit global: 100 req/min (produção)
- ✅ Rate limit criação URLs: 10 URLs/hora por IP
- ✅ Mensagens de erro customizadas
- ✅ Headers de rate limit expostos

#### **2. Validação de URLs**
- ✅ Bloqueio de protocolos perigosos (`javascript:`, `data:`, `vbscript:`)
- ✅ Apenas HTTP/HTTPS permitidos
- ✅ Bloqueio de localhost/IPs privados em produção
- ✅ Validação de formato de shortUrl (alfanumérico, _, -)
- ✅ Limite de tamanho (3-50 caracteres)

#### **3. Headers de Segurança**
- ✅ Helmet.js implementado
- ✅ CSP (Content Security Policy)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options

#### **4. CORS Restrito**
- ✅ Origins específicos em produção
- ✅ Métodos limitados (GET, POST, DELETE)
- ✅ Headers controlados

#### **5. Tratamento de Erros**
- ✅ Stack traces ocultos em produção
- ✅ Logs de erro centralizados
- ✅ Mensagens sanitizadas

#### **6. Database Security**
- ✅ Connection pooling configurado
- ✅ SSL enforced em produção
- ✅ Prepared statements (Drizzle ORM)

#### **7. Container Security**
- ✅ Usuário não-root (nodejs:1001)
- ✅ Multi-stage build
- ✅ Minimal Alpine image
- ✅ dumb-init para signal handling

### ⚠️ **Ainda Necessário Configurar**

#### **1. Variáveis de Ambiente**
```bash
# OBRIGATÓRIO definir em produção:
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db?ssl=require
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_BUCKET=your_bucket_name
CLOUDFLARE_PUBLIC_URL=https://your_bucket_url
```

#### **2. Database em Produção**
```sql
-- Índices obrigatórios para performance
CREATE INDEX CONCURRENTLY idx_urls_short_url ON urls(short_url);
CREATE INDEX CONCURRENTLY idx_urls_created_at ON urls(created_at);
CREATE INDEX CONCURRENTLY idx_urls_access_count ON urls(access_count);

-- Configurações PostgreSQL recomendadas
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
```

#### **3. Configuração de Servidor Web (Nginx)**
```nginx
# Rate limiting adicional no nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=redirect:10m rate=50r/s;

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL/TLS
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS;
    
    # Headers de segurança adicionais
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3333;
    }
    
    location / {
        limit_req zone=redirect burst=100 nodelay;
        proxy_pass http://localhost:3333;
    }
}
```

## ⚡ **Otimizações de Performance**

### **1. Database Optimizations**
- ✅ Connection pooling (max: 20 conexões)
- ✅ Query optimization com índices
- ⚠️  **TODO**: Implementar cache Redis para URLs populares
- ⚠️  **TODO**: Arquivar URLs antigas (>1 ano)

### **2. Application Optimizations**
```typescript
// TODO: Implementar cache em memória
import NodeCache from 'node-cache';
const urlCache = new NodeCache({ stdTTL: 600 }); // 10 minutos

// TODO: Batch operations para estatísticas
// Incrementar access_count em batches a cada 30s
```

### **3. Monitoring & Observability**
```typescript
// TODO: Implementar métricas
import prometheus from 'prom-client';

const urlCreated = new prometheus.Counter({
  name: 'urls_created_total',
  help: 'Total number of URLs created'
});

const urlAccessed = new prometheus.Counter({
  name: 'urls_accessed_total',
  help: 'Total number of URL redirects'
});
```

## 🔧 **Comandos de Deploy**

### **1. Build e Deploy Local**
```bash
# Teste local primeiro
NODE_ENV=production pnpm build
NODE_ENV=production pnpm start

# Build Docker
docker build -t brev.ly:latest .
docker run -p 3333:3333 --env-file .env.production brev.ly:latest
```

### **2. Deploy em Produção**
```bash
# 1. Fazer backup do banco
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 2. Executar migrations
pnpm db:migrate

# 3. Build e deploy
docker build -t brev.ly:v1.0.0 .
docker tag brev.ly:v1.0.0 registry.com/brev.ly:v1.0.0
docker push registry.com/brev.ly:v1.0.0

# 4. Deploy com zero downtime
docker-compose up -d --no-deps brev-ly
```

## 🚨 **Vulnerabilidades Conhecidas**

### **⚠️  Moderate: esbuild (desenvolvimento apenas)**
- **Pacote**: `drizzle-kit` → `esbuild@0.18.20`
- **Risco**: Baixo (apenas em desenvolvimento)
- **Mitigação**: Não afeta produção (esbuild não é usado em runtime)

### **✅ Dependências Atualizadas**
- `@eslint/plugin-kit`: Corrigido
- Todas as dependências principais atualizadas

## 📊 **Monitoramento Essencial**

### **1. Métricas de Sistema**
- CPU usage < 70%
- Memory usage < 80%
- Database connections < 15/20
- Response time < 100ms (p95)

### **2. Métricas de Aplicação**
- Rate limit hits
- URL creation rate
- Top accessed URLs
- Error rates por endpoint

### **3. Alertas Críticos**
- Rate limit > 80% da capacidade
- Database connection pool > 90%
- Error rate > 5%
- Response time > 500ms

## 🔥 **Checklist Final de Deploy**

- [ ] Variáveis de ambiente configuradas
- [ ] ALLOWED_ORIGINS definido corretamente
- [ ] SSL/TLS certificados válidos
- [ ] Database indices criados
- [ ] Backup do banco realizado
- [ ] Rate limiting testado
- [ ] Health checks funcionando
- [ ] Logs centralizados configurados
- [ ] Monitoramento ativo
- [ ] Plano de rollback definido

## 🚀 **Performance Benchmarks**

### **Targets de Performance**
- **Latência**: < 50ms (p95) para redirects
- **Throughput**: > 1000 RPS para redirects
- **Disponibilidade**: > 99.9%
- **TTFB**: < 100ms

### **Load Testing**
```bash
# Teste de carga para redirects
k6 run --vus 100 --duration 30s redirect-test.js

# Teste de carga para API
k6 run --vus 50 --duration 60s api-test.js
```

**🎯 Com essas implementações, sua aplicação estará pronta para produção com alta segurança e performance!** 