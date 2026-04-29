# 🤝 DoaLink — Frontend
 
> Sistema web para organização de doações em situações de enchente no Brasil.
 
🌐 **[Acesse o sistema](https://doa-link-umber.vercel.app)** | ⚙️ **[API](https://api-doalink.onrender.com)**
 
---

## Tecnologias Utilizadas

- **React** — Biblioteca para construção de interfaces
- **Vite** — Ferramenta de build e desenvolvimento
- **React Router DOM** — Navegação entre páginas
- **Axios** — Requisições HTTP para a API

---

## Páginas

| Página | Rota | Descrição |
|--------|------|-----------|
| Home | `/` | Visão geral com estatísticas e necessidades urgentes |
| Pontos de Coleta | `/pontos` | Listagem e cadastro de pontos |
| Itens | `/itens` | Catálogo de itens para doação |
| Necessidades | `/necessidades` | O que cada ponto precisa receber |
| Doadores | `/doadores` | Cadastro e listagem de doadores |
| Fazer Doação | `/doacoes` | Registro de doações com atualização automática |

---

## 🌐 Deploy
 
| Serviço | URL |
|---------|-----|
| 🖥️ Frontend | [doa-link-umber.vercel.app](https://doa-link-umber.vercel.app) |
| ⚙️ Backend | [api-doalink.onrender.com](https://api-doalink.onrender.com) |
 
---

## Como Rodar o Projeto

### Pré-requisitos
- Node.js
- Backend DoaLink rodando em `http://localhost:3000`

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/doalink-frontend.git

# Entre na pasta
cd doalink-frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em `http://localhost:5173`

---

## Conexão com o Backend

A URL base da API está configurada em `src/services/api.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:3000'
})
```

---

## 🔗 Repositórios
 
| Repositório | Link |
|-------------|------|
| Frontend | [github.com/Michele-Costaa/DoaLink](https://github.com/Michele-Costaa/DoaLink) |
| Backend | [github.com/Michele-Costaa/API-DoaLink](https://github.com/Michele-Costaa/API-DoaLink) |
