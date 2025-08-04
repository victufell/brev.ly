# ESLint & Prettier

## Motivação

ESLint e Prettier foram escolhidos como ferramentas de qualidade de código para garantir consistência, legibilidade e manutenibilidade do código, seguindo as melhores práticas da comunidade JavaScript/TypeScript.

## Benefícios

### 1. Consistência de Código
- **Padrões uniformes**: Código consistente em todo o projeto
- **Team collaboration**: Facilita colaboração em equipe
- **Code reviews**: Reviews mais eficientes
- **Maintainability**: Código mais fácil de manter

### 2. Detecção de Problemas
- **Early bug detection**: Detecção precoce de bugs
- **Best practices**: Aplicação de melhores práticas
- **Security issues**: Identificação de problemas de segurança
- **Performance issues**: Otimizações de performance

### 3. Developer Experience
- **IDE integration**: Integração com editores
- **Auto-fix**: Correção automática de problemas
- **Real-time feedback**: Feedback em tempo real
- **Learning tool**: Ferramenta de aprendizado

### 4. TypeScript Support
- **Type-aware rules**: Regras conscientes de tipos
- **Import validation**: Validação de imports
- **Type checking**: Verificação de tipos
- **Modern syntax**: Suporte a sintaxe moderna

## Configuração no Projeto

### ESLint Config
```javascript
// eslint.config.js
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
```

### Prettier Config
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## Regras ESLint Implementadas

### 1. TypeScript Rules
```javascript
'@typescript-eslint/no-unused-vars': 'error',
'@typescript-eslint/no-explicit-any': 'warn',
'@typescript-eslint/explicit-function-return-type': 'off',
'@typescript-eslint/explicit-module-boundary-types': 'off',
'@typescript-eslint/no-inferrable-types': 'off',
```

### 2. General Rules
```javascript
'prefer-const': 'error',
'no-var': 'error',
'no-console': 'warn',
'no-debugger': 'error',
'no-unused-expressions': 'error',
```

### 3. Import Rules
```javascript
'import/order': [
  'error',
  {
    groups: [
      'builtin',
      'external',
      'internal',
      'parent',
      'sibling',
      'index',
    ],
  },
],
'import/no-unresolved': 'error',
```

## Scripts de Linting

### Package.json
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write src/**/*.ts",
    "format:check": "prettier --check src/**/*.ts"
  }
}
```

## Integração com Editores

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["typescript"]
}
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Exemplos de Uso

### Antes (Código não formatado)
```typescript
import {FastifyRequest,FastifyReply} from 'fastify';
import {UrlService} from '../services/url-service.js';
import type {CreateUrlInput} from '../types/index.js';

export class UrlController{
static async createUrl(request:FastifyRequest<{Body:CreateUrlInput}>,reply:FastifyReply){
try{
const url=await UrlService.createUrl(request.body);
return reply.status(201).send({url,message:'URL encurtada criada com sucesso'});
}catch(error){
if(error instanceof Error){
return reply.status(400).send({error:error.message});
}
return reply.status(500).send({error:'Erro interno do servidor'});
}
}
}
```

### Depois (Código formatado)
```typescript
import type { FastifyRequest, FastifyReply } from 'fastify';
import { UrlService } from '../services/url-service.js';
import type { CreateUrlInput } from '../types/index.js';

export class UrlController {
  static async createUrl(
    request: FastifyRequest<{ Body: CreateUrlInput }>,
    reply: FastifyReply
  ) {
    try {
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
}
```

## Configurações Específicas

### 1. TypeScript Import Rules
```javascript
'@typescript-eslint/consistent-type-imports': [
  'error',
  {
    prefer: 'type-imports',
    disallowTypeAnnotations: false,
  },
],
```

### 2. Fastify Rules
```javascript
'@typescript-eslint/no-floating-promises': 'error',
'@typescript-eslint/await-thenable': 'error',
'@typescript-eslint/no-misused-promises': 'error',
```

### 3. Database Rules
```javascript
'@typescript-eslint/no-unused-vars': [
  'error',
  {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
  },
],
```

## Workflow de Desenvolvimento

### 1. Durante o Desenvolvimento
```bash
# Verificar problemas
pnpm lint

# Corrigir automaticamente
pnpm lint:fix

# Formatar código
pnpm format
```

### 2. Pre-commit
```bash
# Hooks automáticos
git add .
git commit -m "feat: add new feature"
# ESLint e Prettier executam automaticamente
```

### 3. CI/CD
```yaml
# .github/workflows/ci.yml
- name: Lint
  run: pnpm lint

- name: Format Check
  run: pnpm format:check
```

## Benefícios para o Projeto

### 1. Qualidade de Código
- **Consistency**: Código consistente em todo o projeto
- **Readability**: Código mais legível
- **Maintainability**: Fácil manutenção
- **Debugging**: Debugging mais eficiente

### 2. Team Productivity
- **Onboarding**: Novos desenvolvedores se adaptam rapidamente
- **Code reviews**: Reviews mais focados em lógica
- **Collaboration**: Menos conflitos de merge
- **Standards**: Padrões claros para todos

### 3. Error Prevention
- **Type safety**: Detecção de erros de tipo
- **Import issues**: Problemas de import detectados
- **Unused code**: Código não utilizado identificado
- **Best practices**: Melhores práticas aplicadas

## Considerações

- **Learning curve**: Configuração inicial pode ser complexa
- **Performance**: Pode adicionar tempo ao build
- **Flexibility**: Algumas regras podem ser muito restritivas

## Alternativas Consideradas

- **Standard**: Mais simples, mas menos flexível
- **XO**: Popular, mas menos customizável
- **Rome**: Moderno, mas menos maduro
- **Biome**: Rápido, mas menos features 