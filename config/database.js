const mysql = require('mysql')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'rigdb_rev2',
    port: 3306,
    multipleStatements: true
})

module.exports = db