# 📝 Todo Kanban

Seja muito bem-vindo(a) ao **Todo Kanban**! 👋

Este é um projeto de gerenciador de tarefas (estilo Kanban) super amigável e focado em uso estritamente local. A ideia é ser uma ferramenta simples, rápida e direta ao ponto para você organizar suas atividades diárias no seu próprio computador.

> **⚠️ Aviso:** Esta é apenas a **primeira versão (v1.0)** do projeto! Ainda tem MUITO a ser adicionado. Muitas novidades e melhorias estão por vir. Fique à vontade para acompanhar a evolução!

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com ferramentas modernas do ecossistema front-end:

- **[React](https://reactjs.org/)** + **[Vite](https://vitejs.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)** para a estilização ágil e moderna
- **[json-server](https://github.com/typicode/json-server)** para simular um backend/banco de dados local de forma prática
- **[Lucide React](https://lucide.dev/)** para os ícones

---

## 🚀 Como instalar e usar (Localmente)

Siga os passos abaixo para rodar o projeto na sua máquina:

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado no seu computador.

### 2. Clone o repositório
No seu terminal, clone o projeto e entre na pasta:
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```
*(Lembre-se de substituir o link acima pela URL correta do seu fork/repositório).*

### 3. Instale as dependências
```bash
npm install
```

### 4. Configure o Banco de Dados Local
O projeto utiliza um arquivo `.json` local para salvar as suas tarefas. Para não correr o risco de subir suas tarefas privadas para o GitHub, o arquivo principal foi ignorado no git.

Para criar o seu banco:
1. Copie o arquivo de exemplo para o arquivo definitivo:
```bash
cp db.example.json db.json
```

### 5. Rode a aplicação

Para que tudo funcione corretamente, você precisará abrir **dois terminais** na pasta do projeto.

**Terminal 1:** Iniciar o backend local (API)
```bash
npm run server
```
*(O servidor rodará na porta `5000`)*

**Terminal 2:** Iniciar o frontend
```bash
npm run dev
```

Pronto! Agora é só acessar a URL gerada pelo Vite (geralmente `http://localhost:5173`) no seu navegador e começar a arrastar seus cards!

---

## 🌱 Próximos Passos
Como destacado, esta é a v1.0. O céu é o limite e várias atualizações estão no radar, como:
- Refinamento visual e novas animações
- Mais opções de filtro
- Melhorias na validação de formulários

Sinta-se livre para usar, estudar e modificar.
