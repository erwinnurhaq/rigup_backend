const util = require('util')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { createToken } = require('../config/jwt')
const db = require('../config/database')
const query = util.promisify(db.query).bind(db)

module.exports = {

    getAllUsers: async (req, res) => {
        try {
            const users = await query('SELECT * FROM users')
            res.status(200).send(users)
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    delete: async (req, res) => {
        try {
            await query('DELETE FROM users WHERE id = ?', [req.params.id])
            res.status(200).send({ message: 'User deleted successfully' })
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    register: async (req, res) => {
        try {
            const check = await query('SELECT * FROM users WHERE username = ? OR email = ?', [
                req.body.username,
                req.body.email
            ])
            if (check.length === 0) {
                const hash = bcrypt.hashSync(req.body.password, 10)
                delete req.body.confirmPass

                const insert = await query('INSERT INTO users SET ?', {
                    ...req.body,
                    password: hash,
                    createdTime: moment().utc().format('YYYY-MM-DD hh:mm:ss'),
                    roleId: 2
                })

                const user = await query('SELECT * FROM user_complete WHERE id = ?', [insert.insertId])

                let token = createToken({
                    id: user[0].id,
                    email: user[0].email,
                    roleId: user[0].roleId
                }, { expiresIn: '24h' })

                delete user[0].roleId
                res.status(200).send({ user: user[0], token })

            } else {
                res.status(400).send({ error: 'Username or email exist' })
            }
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    login: async (req, res) => {
        try {
            console.log(req.body)
            const sql = `SELECT * FROM user_complete WHERE username = ? OR email = ?`
            let check = await query(sql, [req.body.userOrEmail, req.body.userOrEmail])
            console.log(check)

            if (check.length !== 0 && bcrypt.compareSync(req.body.password, check[0].password)) {
                let dataForToken = {
                    id: check[0].id,
                    email: check[0].email,
                    roleId: check[0].roleId
                }
                let token = req.body.keepLogin ? createToken(dataForToken) : createToken(dataForToken, { expiresIn: '24h' })

                await query('UPDATE users SET ? WHERE id = ?', [{
                    lastLogin: moment().utc().format('YYYY-MM-DD hh:mm:ss')
                }, check[0].id])

                delete check[0].password
                delete check[0].roleId
                res.status(200).send({ user: check[0], token })
            } else {
                res.status(404).send({ error: 'Username or password is wrong' })
            }
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    edit: async (req, res) => {
        try {
            const user = await query('SELECT * FROM users WHERE email = ?', [req.user.email])

            if (user.length !== 0) {
                for (const key in req.body) {
                    if (req.body[key] === '' || req.body[key] === null) req.body[key] = user[0][key]
                }
                console.log(req.body)
                await query('UPDATE users SET ? WHERE id = ?', [{
                    ...req.body,
                    updatedTime: moment().utc().format('YYYY-MM-DD hh:mm:ss')
                }, user[0].id])
                res.status(200).send({ message: 'Edit success' })
            } else {
                res.status(404).send({ error: 'User not found' })
            }
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    changePass: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body
            const user = await query('SELECT * FROM users WHERE email = ?', [req.user.email])

            if (user.length !== 0 && bcrypt.compareSync(currentPassword, user[0].password)) {
                await query('UPDATE users SET ? WHERE id = ?', [{
                    password: bcrypt.hashSync(newPassword, 10),
                    updatedTime: moment().utc().format('YYYY-MM-DD hh:mm:ss')
                }, user[0].id])
                res.status(200).send({ message: 'Edit success' })
            } else {
                res.status(400).send({ error: 'Wrong current password' })
            }
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    keepLogin: async (req, res) => {
        try {
            console.log(req.user)
            const sql = `SELECT * FROM user_complete WHERE id = ? AND email = ?`
            const check = await query(sql, [
                req.user.id,
                req.user.email
            ])
            await query('UPDATE users SET ? WHERE id = ?', [{
                lastLogin: moment().utc().format('YYYY-MM-DD hh:mm:ss')
            }, check[0].id])
            delete check[0].password
            res.status(200).send({ user: check[0] })
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    cityList: async (req, res) => {
        try {
            const cities = await query(`SELECT * FROM user_cities`)
            res.status(200).send(cities)
        } catch (error) {
            res.status(500).send({ error })
        }
    }

}