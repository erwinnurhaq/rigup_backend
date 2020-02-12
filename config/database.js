const mysql = require('mysql')

const db = mysql.createConnection({
    host: process.env.DB || 'localhost',
    user: process.env.MYSQL_USER || 'enurhaq',
    password: process.env.MYSQL_PASSWORD,
    database: 'rigdb_rev',
    port: 3306
    // multipleStatements: true
})

module.exports = db