### Arquitetura do Projeto

- Frontend: React.js com Vite para inicialização rápida.
- Backend: Node.js com Express.
- Banco de Dados: SQLite (armazenamento local simples e eficiente).
- Design: Responsivo, usando CSS/SCSS ou frameworks como Tailwind CSS.
- Controle de versão: Git e GitHub para colaboração.
- Ferramentas adicionais: Figma para design, Postman para testes de API.

### Estrutura do Repositório
```prompt
comercio/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── database.sqlite
│   └── package.json
├── README.md
├── .gitignore
└── .env
```

### Desenvolvimento do Backend

Objetivo: Criar a API para gerenciar produtos, serviços e contatos.

#### Inicializar o Projeto

Criar o projeto do backend:

```
mkdir backend
cd backend
npm init -y
npm install express sqlite3 cors dotenv
npm install --save-dev nodemon
```

Adicionar scripts no package.json:

```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js"
}
```

Passo 2: Configurar o Servidor
Criar o arquivo principal src/app.js:

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});
```

### Configurar Banco de Dados
Criar o arquivo src/database.js:

```javascript
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Conectado ao banco de dados SQLite.');
});

module.exports = db;
```

Criar tabelas:

```javascript
const db = require('./database');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            price REAL,
            imageUrl TEXT
        )
    `);
});
```

### Criar Rotas
Criar rota para listar produtos:

```javascript
const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

module.exports = router;
```

Integrar rotas no app.js:

```javascript
const productRoutes = require('./routes/products');
app.use('/api', productRoutes);
```

### Desenvolvimento do Frontend
Objetivo: Criar a interface do usuário e consumir a API.

#### Inicializar o Projeto
Criar o projeto React:

```prompt
mkdir frontend
cd frontend
npm create vite@latest .
npm install
npm install axios react-router-dom
```

Estruturar o diretório src:
```prompt
src/
├── components/
│   ├── ProductCard.jsx
├── pages/
│   ├── Home.jsx
│   ├── Contact.jsx
├── App.jsx
└── main.jsx
```

#### Criar Componentes
ProductCard.jsx:

```javascript
import React from 'react';

const ProductCard = ({ product }) => (
    <div className="product-card">
        <img src={product.imageUrl} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>{product.price}</p>
    </div>
);

export default ProductCard;
```

Home.jsx:

```javascript
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Produtos</h1>
            <div className="product-list">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Home;
```

Criar navegação no App.jsx:

```javascript
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    </Router>
);

export default App;
```

#### Design Responsivo e Estilização
Objetivo: Garantir que o site funcione em diversos dispositivos e seja bem estilizado

Configurar Tailwind CSS:

```prompt
npm install -D tailwindcss
npx tailwindcss init
```


Vamos continuar o projeto avançando no frontend e no backend com foco na tabela products. Vamos implementar funcionalidades básicas (CRUD de produtos) no backend, consumir a API no frontend e criar um layout simples e moderno usando Tailwind CSS.

### Backend

Vamos adicionar as seguintes rotas à API no backend:

- Adicionar Produto: Criar um novo produto.
- Editar Produto: Atualizar os detalhes de um produto existente.
- Deletar Produto: Remover um produto.

#### Rotas no Backend
Atualize o arquivo productRoutes.js:

```javascript
const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Obter todos os produtos
router.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (error, rows) => {
    if (error) return res.status(500).send(error.message);
    res.json(rows);
  });
});

// Adicionar um produto
router.post("/products", (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const query = "INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)";
  db.run(query, [name, description, price, imageUrl], function (error) {
    if (error) return res.status(500).send(error.message);
    res.status(201).send({ id: this.lastID });
  });
});

// Atualizar um produto
router.put("/products/:id", (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const { id } = req.params;
  const query = "UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?";
  db.run(query, [name, description, price, imageUrl, id], function (error) {
    if (error) return res.status(500).send(error.message);
    res.send({ message: "Produto atualizado com sucesso" });
  });
});

// Deletar um produto
router.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";
  db.run(query, id, function (error) {
    if (error) return res.status(500).send(error.message);
    res.send({ message: "Produto deletado com sucesso" });
  });
});

module.exports = router;
```

Dessa forma, temos um serviço backend realizando as ações de um CRUD para a tabela produtos.

### Frontend

Instale junto ao tailwindcss, outras duas dependências para o uso do mesmo: 

```prompt
npm install tailwindcss postcss autoprefixer
```

Altere o arquivo `vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
});

```

E adicione o arquivo `postcss.config.js`:

```javascript
export default {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };
  
```

#### Criando o Layout

Atualize os componentes para exibir os produtos em um layout simples.

```javascript
Copiar código
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const App = () => (
  <Router>
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  </Router>
);

export default App;
```

- Home.jsx
Implementando a página inicial para listar os produtos e consumir a API, com tailwind css.

```javascript
import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);

  // Buscar produtos na API
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Lista de Produtos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-40 w-full object-cover rounded-t-md"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-green-500 font-bold mt-2">R$ {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
```

#### Criando Interatividade para Adicionar Produtos

- Crie um formulário simples para adicionar produtos.

Na página Home, vamos implementar o formulário para cadastro de produtos no banco de dados, com tailwind cssm conectado ao serviço backend

```javascript
import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/products", newProduct)
      .then(() => {
        setProducts((prev) => [...prev, newProduct]);
        setNewProduct({ name: "", description: "", price: "", imageUrl: "" });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Lista de Produtos</h1>

      {/* Formulário para adicionar produtos */}
      <form
        className="bg-white p-4 rounded-lg shadow-md mb-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold mb-2">Adicionar Produto</h2>
        <input
          type="text"
          placeholder="Nome do Produto"
          className="w-full p-2 border rounded mb-2"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Descrição"
          className="w-full p-2 border rounded mb-2"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          required
        ></textarea>
        <input
          type="number"
          placeholder="Preço"
          className="w-full p-2 border rounded mb-2"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
          }
          required
        />
        <input
          type="text"
          placeholder="URL da Imagem"
          className="w-full p-2 border rounded mb-2"
          value={newProduct.imageUrl}
          onChange={(e) =>
            setNewProduct({ ...newProduct, imageUrl: e.target.value })
          }
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Adicionar Produto
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-40 w-full object-cover rounded-t-md"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-green-500 font-bold mt-2">R$ {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
```

### Testes e Finalização
Objetivo: Testar o sistema e corrigir bugs.

#### Testar o Backend

- Testar endpoints com Postman.
- Garantir que o banco de dados está persistindo corretamente.

#### Testar o Frontend

- Verificar responsividade em diferentes dispositivos.
- Garantir que as requisições à API estão funcionando.


### Deploy
Objetivo: Hospedar o projeto.

- Frontend: Deploy no Vercel.
- Backend: Deploy no Render ou Railway.
- Banco de Dados: Usar arquivo SQLite no backend.
