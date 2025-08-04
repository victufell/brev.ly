# Docker

## Motivação

O Docker foi escolhido como solução de containerização para garantir consistência entre ambientes de desenvolvimento e produção, facilitar o deploy e escalabilidade da aplicação Brev.ly.

## Benefícios

### 1. Consistência de Ambiente
- **Dev-prod parity**: Ambientes idênticos
- **Dependency isolation**: Isolamento de dependências
- **Version control**: Controle de versões de dependências
- **Reproducible builds**: Builds reproduzíveis

### 2. Portabilidade
- **Cross-platform**: Funciona em qualquer sistema operacional
- **Cloud deployment**: Deploy fácil em qualquer cloud
- **Local development**: Desenvolvimento local consistente
- **CI/CD integration**: Integração com pipelines

### 3. Escalabilidade
- **Horizontal scaling**: Escalabilidade horizontal
- **Load balancing**: Balanceamento de carga
- **Resource optimization**: Otimização de recursos
- **Microservices**: Arquitetura de microserviços

### 4. Segurança
- **Isolation**: Isolamento de processos
- **User permissions**: Permissões de usuário
- **Image scanning**: Escaneamento de imagens
- **Vulnerability management**: Gerenciamento de vulnerabilidades

## Configuração no Projeto

### Dockerfile Multi-stage
```dockerfile
# Estágio de build
FROM node:20-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Gerar migrations
RUN pnpm db:generate

# Build da aplicação
RUN pnpm build

# Estágio de produção
FROM node:20-alpine AS production

# Instalar pnpm
RUN npm install -g pnpm

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Copiar código compilado do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/database/migrations ./src/database/migrations

# Mudar propriedade dos arquivos para o usuário nodejs
RUN chown -R nodejs:nodejs /app

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
```

## Otimizações Implementadas

### 1. Multi-stage Build
- **Build stage**: Compilação e dependências de desenvolvimento
- **Production stage**: Apenas dependências de produção
- **Size reduction**: Redução significativa do tamanho da imagem
- **Security**: Menos vulnerabilidades em produção

### 2. Layer Caching
```dockerfile
# Copiar apenas package.json primeiro para cache de dependências
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiar código fonte depois
COPY . .
```

### 3. Security Best Practices
```dockerfile
# Usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Permissões corretas
RUN chown -R nodejs:nodejs /app
```

### 4. Health Check
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"
```

## Docker Compose

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3333:3333"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/brevly
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=brevly
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

### docker-compose.dev.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3333:3333"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/brevly_dev
    volumes:
      - .:/app
      - /app/node_modules
    command: pnpm dev
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=brevly_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_dev_data:
```

## Scripts de Docker

### Package.json
```json
{
  "scripts": {
    "docker:build": "docker build -t brevly-api .",
    "docker:run": "docker run -p 3333:3333 --env-file .env brevly-api",
    "docker:compose": "docker-compose up -d",
    "docker:compose:dev": "docker-compose -f docker-compose.dev.yml up",
    "docker:stop": "docker-compose down",
    "docker:logs": "docker-compose logs -f app"
  }
}
```

## Deploy com Docker

### 1. Build da Imagem
```bash
# Build local
docker build -t brevly-api .

# Build para registry
docker build -t registry.example.com/brevly-api:v1.0.0 .
docker push registry.example.com/brevly-api:v1.0.0
```

### 2. Deploy em Produção
```bash
# Pull da imagem
docker pull registry.example.com/brevly-api:v1.0.0

# Run com variáveis de ambiente
docker run -d \
  --name brevly-api \
  -p 3333:3333 \
  --env-file .env.production \
  --restart unless-stopped \
  registry.example.com/brevly-api:v1.0.0
```

### 3. Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: brevly-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: brevly-api
  template:
    metadata:
      labels:
        app: brevly-api
    spec:
      containers:
      - name: brevly-api
        image: registry.example.com/brevly-api:v1.0.0
        ports:
        - containerPort: 3333
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: brevly-secrets
              key: database-url
        livenessProbe:
          httpGet:
            path: /health
            port: 3333
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3333
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Monitoramento e Logs

### 1. Logs
```bash
# Ver logs do container
docker logs brevly-api

# Follow logs
docker logs -f brevly-api

# Logs com timestamp
docker logs -t brevly-api
```

### 2. Health Checks
```bash
# Verificar status do health check
docker inspect brevly-api | grep Health -A 10

# Executar health check manualmente
docker exec brevly-api node -e "require('http').get('http://localhost:3333/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"
```

### 3. Resource Monitoring
```bash
# Ver uso de recursos
docker stats brevly-api

# Ver processos dentro do container
docker exec brevly-api ps aux
```

## Segurança

### 1. Image Security
```bash
# Escanear imagem para vulnerabilidades
docker scan brevly-api

# Usar imagens oficiais
FROM node:20-alpine
```

### 2. Runtime Security
```dockerfile
# Usuário não-root
USER nodejs

# Permissões mínimas
RUN chown -R nodejs:nodejs /app
```

### 3. Network Security
```yaml
# Docker Compose com rede isolada
networks:
  default:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

## Performance

### 1. Image Size
- **Multi-stage build**: Redução de ~800MB para ~200MB
- **Alpine base**: Imagem base menor
- **Production dependencies**: Apenas dependências necessárias

### 2. Build Time
- **Layer caching**: Cache de dependências
- **Parallel builds**: Builds paralelos
- **Optimized Dockerfile**: Dockerfile otimizado

### 3. Runtime Performance
- **Minimal overhead**: Overhead mínimo
- **Resource limits**: Limites de recursos
- **Efficient startup**: Inicialização eficiente

## Considerações

- **Learning curve**: Conceitos específicos do Docker
- **Debugging**: Debugging mais complexo
- **Storage**: Uso de espaço em disco

## Alternativas Consideradas

- **Podman**: Similar, mas sem daemon
- **Buildah**: Build de imagens
- **Skopeo**: Manipulação de imagens
- **Containerd**: Runtime de containers 