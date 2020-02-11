const mysql = require('mysql')

const db = mysql.createConnection({
    host: process.env.DB || 'db',
    user: 'root',
    password: 'lollipop.',
    database: 'rigdb',
    port: 3306
    // multipleStatements: true
})

module.exports = db