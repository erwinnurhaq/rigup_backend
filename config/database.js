const mysql = require('mysql')

const db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.HOST,
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'rigdb_rev2',
    port: 3306
})
// const db = mysql.createConnection({
//     host: process.env.HOST,
//     user: 'root',
//     password: process.env.MYSQL_PASSWORD,
//     database: 'rigdb_rev2',
//     port: 3306,
//     multipleStatements: true
// })

// 35.238.37.11

module.exports = db