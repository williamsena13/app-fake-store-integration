# Fake Store Integration - Frontend

SPA em React + Vite + TypeScript com PrimeReact para consumir a API Laravel do sistema de integração com Fake Store.

## 🛠️ Tecnologias

- React 18 + Vite + TypeScript
- PrimeReact + PrimeIcons + PrimeFlex
- TanStack Query + Axios
- React Router DOM + React Hot Toast


## 📋 Pré-requisitos

- Node.js 18+
- Yarn
- Back-end Laravel: [api-fake-store-integration](https://github.com/williamsena13/api-fake-store-integration)

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/williamsena13/app-fake-store-integration.git
cd app-fake-store-integration
```

2. **Instale as dependências:**
```bash
yarn install
```

3. **Configure variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme o ambiente:

### Ambientes Disponíveis

**LOCAL** (desenvolvimento local):
```env
VITE_NODE_ENV=local
VITE_CLIENT_ID=demo
VITE_API_LOCAL_URL=http://localhost:8000/api
```

**DEVELOPER** (ambiente de desenvolvimento compartilhado):
```env
VITE_NODE_ENV=development
VITE_CLIENT_ID=demo
VITE_API_DEVELOPER_URL=http://api-fake-store-integration.test/api
```

**PRODUCTION** (produção):
```env
VITE_NODE_ENV=production
VITE_CLIENT_ID=demo
VITE_API_PRODUCTION_URL=http://api-fakestore.bassena.com.br/api
```

4. **Execute o projeto:**
```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🚀 Deploy em Produção

1. **Build:**
```bash
yarn build
```

2. **Configurar .htaccess** (necessário para SPA):
Crie um arquivo `.htaccess` na pasta `dist/` após o build:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

3. **Upload** da pasta `dist/` para o servidor web

## 🏗️ Scripts Disponíveis

```bash
yarn dev          # Servidor de desenvolvimento (porta 5173)
yarn build        # Build para produção (pasta dist/)
yarn preview      # Preview do build de produção
yarn lint         # Linter ESLint
```

