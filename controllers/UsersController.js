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
            res.status(500).send(error)
        }
    },

    delete: async (req, res) => {
        try {
            await query('DELETE FROM users WHERE id = ?', [req.params.id])
            res.status(200).send({ message: 'User deleted successfully' })
        } catch (error) {
            res.status(500).send(error)
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
                const result = await query('INSERT INTO users SET ?', {
                    ...req.body,
                    password: hash,
                    created_time: moment().utc().format('YYYY-MM-DD hh:mm:ss'),
                    role_id: 3
                })
                res.status(200).send({
                    userId: result.insertId,
                    message: 'User added successfully'
                })
            } else {
                res.status(400).send({ error: 'Username or email exist' })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    login: async (req, res) => {
        try {
            const check = await query('SELECT * FROM users WHERE username = ? OR email = ?', [
                req.body.userOrEmail,
                req.body.userOrEmail
            ])
            if (check.length !== 0 && bcrypt.compareSync(req.body.password, check[0].password)) {
                const token = createToken({
                    id: check[0].id,
                    email: check[0].email,
                    role_id: check[0].role_id
                }, { expiresIn: '24h' })
                await query('UPDATE users SET ? WHERE id = ?', [{
                    last_login: moment().utc().format('YYYY-MM-DD hh:mm:ss')
                }, check[0].id])
                res.status(200).send({ user: check[0], token })
            } else {
                res.status(404).send({ error: 'Username or password is wrong' })
            }
        } catch (error) {
            res.status(500).send(error)
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
                    updated_time: moment().utc().format('YYYY-MM-DD hh:mm:ss')
                }, user[0].id])
                res.status(200).send({ message: 'Edit success' })
            } else {
                res.status(404).send({ error: 'User not found' })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    changePass: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body
            const user = await query('SELECT * FROM users WHERE email = ?', [req.user.email])

            if (user.length !== 0 && bcrypt.compareSync(currentPassword, user[0].password)) {
                await query('UPDATE users SET ? WHERE id = ?', [{
                    password: bcrypt.hashSync(newPassword, 10),
                    updated_time: moment().utc().format('YYYY-MM-DD hh:mm:ss')
                }, user[0].id])
                res.status(200).send({ message: 'Edit success' })
            } else {
                res.status(400).send({ error: 'Wrong current password' })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }

}