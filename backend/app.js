const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./src/routes/productRoutes')

// Middlewares de configuração
app.use(cors());
app.use(express.json());

// Rotas da aplicação
app.use('/api', productRoutes);

app.listen(3001, () => {
    console.log('Servidor rodando na porta http://localhost:3001');
}) 