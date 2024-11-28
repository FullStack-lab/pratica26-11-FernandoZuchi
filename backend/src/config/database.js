const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./src/config/database.sqlite', (erro) => {
    if (erro) 
        console.error(erro.message);
    console.log('Conectado ao banco de dados SQLite.');
})

module.exports = db;