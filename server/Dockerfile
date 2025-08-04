# Estágio de build
FROM node:20-alpine AS builder

# Instalar dependências de segurança
RUN apk add --no-cache dumb-init

# Instalar pnpm
RUN npm install -g pnpm

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

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

# Remover devDependencies
RUN pnpm prune --prod

# Estágio de produção
FROM node:20-alpine AS production

# Instalar dependências de segurança
RUN apk add --no-cache dumb-init

# Instalar pnpm
RUN npm install -g pnpm

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários do estágio de build
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/drizzle.config.ts ./drizzle.config.ts

# Copiar migrations se existirem
COPY --from=builder --chown=nodejs:nodejs /app/drizzle ./drizzle

# Definir variáveis de ambiente de produção
ENV NODE_ENV=production
ENV PORT=3333

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando para iniciar a aplicação com dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"] 