const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD || 'lollipop.',
    database: 'rigdb_rev',
    port: 3306
    // multipleStatements: true
})

module.exports = db