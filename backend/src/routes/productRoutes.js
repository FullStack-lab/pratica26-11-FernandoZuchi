const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (erro, rows) => {
        if (erro)
            return res.status(500).send(erro.message);

        res.json(rows);
    })
})

module.exports = router;