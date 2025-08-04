# pnpm

## Motivação

O pnpm foi escolhido como gerenciador de pacotes principal devido à sua eficiência no uso de espaço em disco, velocidade superior e segurança, oferecendo uma experiência de desenvolvimento mais rápida e confiável.

## Benefícios

### 1. Eficiência de Espaço
- **Disk space**: 80% menos espaço em disco que npm/yarn
- **Symlinks**: Uso de symlinks para compartilhar dependências
- **Deduplication**: Deduplicação automática de pacotes
- **Content-addressable**: Armazenamento baseado em conteúdo

### 2. Performance Superior
- **Installation speed**: 2-3x mais rápido que npm
- **Parallel operations**: Operações paralelas otimizadas
- **Caching**: Cache inteligente e eficiente
- **Network efficiency**: Eficiência de rede melhorada

### 3. Segurança
- **Strict dependency resolution**: Resolução estrita de dependências
- **No phantom dependencies**: Sem dependências fantasmas
- **Deterministic installs**: Instalações determinísticas
- **Lockfile integrity**: Integridade do arquivo de lock

### 4. Monorepo Support
- **Workspaces**: Suporte nativo a workspaces
- **Hoisting control**: Controle de hoisting
- **Cross-dependencies**: Dependências entre pacotes
- **Filtering**: Filtros para operações específicas

## Configuração no Projeto

### Package.json
```json
{
  "name": "brev.ly",
  "version": "1.0.0",
  "packageManager": "pnpm@10.6.5",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "drizzle-kit push:pg",
    "db:generate": "drizzle-kit generate:pg",
    "db:studio": "drizzle-kit studio",
    "test": "vitest",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  }
}
```

### .npmrc
```ini
# Configurações do pnpm
auto-install-peers=true
strict-peer-dependencies=false
save-prefix=""
```

## Comandos Principais

### 1. Instalação
```bash
# Instalar dependências
pnpm install

# Instalar dependência específica
pnpm add fastify

# Instalar dependência de desenvolvimento
pnpm add -D typescript

# Instalar dependência global
pnpm add -g typescript
```

### 2. Execução de Scripts
```bash
# Executar script
pnpm dev

# Executar script com argumentos
pnpm test -- --watch

# Executar script em modo interativo
pnpm dev --interactive
```

### 3. Gerenciamento de Dependências
```bash
# Atualizar dependências
pnpm update

# Remover dependência
pnpm remove lodash

# Listar dependências
pnpm list

# Verificar vulnerabilidades
pnpm audit
```

## Estrutura de Arquivos

### node_modules (pnpm)
```
node_modules/
├── .pnpm/                    # Store de pacotes
│   ├── fastify@5.4.0/
│   ├── typescript@5.8.3/
│   └── ...
├── fastify -> .pnpm/fastify@5.4.0/node_modules/fastify
├── typescript -> .pnpm/typescript@5.8.3/node_modules/typescript
└── ...
```

### Comparação com npm/yarn
```
# npm/yarn (duplicação)
node_modules/
├── fastify/
│   └── node_modules/
│       ├── @fastify/cors/
│       └── ...
├── @fastify/cors/
└── ...

# pnpm (symlinks)
node_modules/
├── .pnpm/
│   ├── fastify@5.4.0/
│   └── @fastify/cors@11.0.1/
├── fastify -> .pnpm/fastify@5.4.0/node_modules/fastify
└── @fastify/cors -> .pnpm/@fastify/cors@11.0.1/node_modules/@fastify/cors
```

## Workspaces (Monorepo)

### pnpm-workspace.yaml
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

### Estrutura de Monorepo
```
brev.ly/
├── packages/
│   ├── shared/
│   │   ├── package.json
│   │   └── src/
│   └── utils/
│       ├── package.json
│       └── src/
├── apps/
│   ├── server/
│   │   ├── package.json
│   │   └── src/
│   └── client/
│       ├── package.json
│       └── src/
└── pnpm-workspace.yaml
```

### Comandos de Workspace
```bash
# Instalar em todos os workspaces
pnpm install

# Executar script em workspace específico
pnpm --filter server dev

# Executar script em todos os workspaces
pnpm --recursive test

# Adicionar dependência a workspace específico
pnpm --filter server add fastify
```

## Performance Comparison

### Benchmarks (tempo de instalação)
- **pnpm**: ~30s
- **yarn**: ~45s
- **npm**: ~60s

### Uso de Disco
- **pnpm**: ~200MB
- **yarn**: ~800MB
- **npm**: ~1GB

### Memória
- **pnpm**: ~150MB
- **yarn**: ~300MB
- **npm**: ~400MB

## Segurança

### 1. Phantom Dependencies
```javascript
// Com npm/yarn (permitido)
import lodash from 'lodash'; // Pode funcionar mesmo sem estar em dependencies

// Com pnpm (bloqueado)
import lodash from 'lodash'; // Erro se não estiver em dependencies
```

### 2. Peer Dependencies
```json
{
  "dependencies": {
    "react": "^18.0.0"
  },
  "peerDependencies": {
    "react": ">=16.0.0"
  }
}
```

### 3. Lockfile Integrity
```bash
# Verificar integridade
pnpm install --frozen-lockfile

# Atualizar lockfile
pnpm install --lockfile-only
```

## Integração com CI/CD

### GitHub Actions
```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm build
```

### Docker
```dockerfile
# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos de lock
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile
```

## Configurações Avançadas

### 1. Registry Configuration
```ini
# .npmrc
registry=https://registry.npmjs.org/
@myorg:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. Scripts Customizados
```json
{
  "scripts": {
    "preinstall": "node scripts/preinstall.js",
    "postinstall": "node scripts/postinstall.js",
    "prepare": "husky install"
  }
}
```

### 3. Dependências Opcionais
```json
{
  "optionalDependencies": {
    "fsevents": "^2.3.0"
  }
}
```

## Troubleshooting

### 1. Problemas Comuns
```bash
# Limpar cache
pnpm store prune

# Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Verificar integridade
pnpm install --frozen-lockfile
```

### 2. Compatibilidade
```bash
# Verificar compatibilidade com npm
pnpm install --shamefully-hoist

# Usar node_modules flat
pnpm install --shamefully-hoist
```

## Considerações

- **Learning curve**: Conceitos específicos do pnpm
- **Ecosystem**: Menor que npm, mas crescente
- **Compatibility**: Algumas ferramentas podem não funcionar

## Alternativas Consideradas

- **npm**: Padrão, mas menos eficiente
- **yarn**: Popular, mas menos eficiente
- **yarn berry**: Moderno, mas mais complexo
- **bun**: Rápido, mas menos maduro 