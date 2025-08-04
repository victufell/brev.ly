# brev.ly - Frontend

Aplicação React para o encurtador de links brev.ly.

## ✨ Funcionalidades

- [ ] Deve ser possível criar um link
  - [ ] Não deve ser possível criar um link com encurtamento mal formatado
  - [ ] Não deve ser possível criar um link com encurtamento já existente
- [ ] Deve ser possível deletar um link
- [ ] Deve ser possível obter a URL original por meio do encurtamento
- [ ] Deve ser possível listar todas as URL's cadastradas
- [ ] Deve ser possível incrementar a quantidade de acessos de um link
- [ ] Deve ser possível baixar um CSV com o relatório dos links criados

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS utilitário
- **React Query** - Gerenciamento de estado do servidor
- **React Hook Form** - Biblioteca para formulários performáticos
- **Zod** - Validação de schemas TypeScript
- **React Router** - Roteamento para React
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

## 📱 Páginas

- **Home (/)** - Formulário de cadastro e listagem de links
- **Redirect (/:shortUrl)** - Página de redirecionamento
- **404** - Página de erro para links não encontrados

## 🛠️ Configuração do Ambiente

1. **Clone o repositório**
```bash
git clone <repository-url>
cd brev.ly/web
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com as configurações corretas:
```env
VITE_FRONTEND_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3333
```

4. **Execute o projeto**
```bash
pnpm dev
```

## 🎯 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Gera o build de produção
- `pnpm preview` - Visualiza o build de produção
- `pnpm lint` - Executa o linter

## 🎨 Style Guide

O projeto segue fielmente o layout do Figma:
- [Layout Completo](https://www.figma.com/design/Iyl7EFL66roGXCIMlRq5wH/Encurtador-de-Links--Community-?node-id=3-376&p=f&t=Z6vQ1XkwbseMhdxq-0)
- [Style Guide](https://www.figma.com/design/Iyl7EFL66roGXCIMlRq5wH/Encurtador-de-Links--Community-?node-id=3-377&p=f&t=Z6vQ1XkwbseMhdxq-0)

## 📱 Responsividade

- **Mobile First** - Desenvolvido priorizando dispositivos móveis
- **Breakpoints TailwindCSS** - sm, md, lg, xl, 2xl
- **Componentes adaptáveis** - Layout flexível para diferentes telas

## 🔧 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── services/      # Integração com APIs
├── hooks/         # Custom hooks
├── utils/         # Funções utilitárias
├── types/         # Definições de tipos TypeScript
└── styles/        # Estilos globais
```

## 🌐 Integração com API

A aplicação integra com a API backend através dos endpoints:

- `POST /urls` - Criar novo link
- `GET /urls` - Listar todos os links
- `GET /urls/:shortUrl` - Buscar link por URL encurtada
- `DELETE /urls/:id` - Deletar link
- `PATCH /urls/:shortUrl/click` - Incrementar cliques
- `GET /urls/export` - Baixar relatório CSV

## 📋 Validações

- **URL Original**: Obrigatória e deve ser uma URL válida (http/https)
- **URL Encurtada**: Opcional, 3-20 caracteres (letras, números, hífens)
- **Feedback visual**: Estados de loading, erro e sucesso
- **UX aprimorada**: Empty states, tooltips, confirmações 