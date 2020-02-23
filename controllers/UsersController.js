const util = require('util')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { createToken } = require('../config/jwt')
const db = require('../config/database')

const dbquery = util.promisify(db.query).bind(db)
const currentTime = () => moment().utc().format('YYYY-MM-DD hh:mm:ss')

module.exports = {

    //get all users
    getAll: async (req, res) => {
        try {
            const users = await dbquery('SELECT * FROM users')
            res.status(200).send(users)
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    //delete user by id
    delete: async (req, res) => {
        try {
            await dbquery('DELETE FROM users WHERE id = ?', [req.params.id])
            res.status(200).send({ message: 'User deleted successfully' })
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    //add new user
    register: async (req, res) => {
        try {
            let query = 'SELECT * FROM users WHERE username = ? OR email = ?'
            const check = await dbquery(query, [req.body.username, req.body.email])

            if (check.length === 0) {
                const hash = bcrypt.hashSync(req.body.password, 10)
                delete req.body.confirmPass     //so it won't be included to query insert

                query = 'INSERT INTO users SET ?'
                const insert = await dbquery(query, {
                    ...req.body,
                    password: hash,
                    createdTime: currentTime(),
                    roleId: 2
                })

                query = 'SELECT * FROM user_complete WHERE id = ?'
                const user = await dbquery(query, [insert.insertId])

                let token = createToken({
                    id: user[0].id,
                    email: user[0].email,
                    roleId: user[0].roleId
                }, { expiresIn: '24h' })

                delete user[0].roleId   //so it won't be included to response data, roleId just in token
                res.status(200).send({ user: user[0], token })

            } else {
                res.status(400).send({ error: 'Username or email exist' })
            }
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    //login function with email/username and password
    login: async (req, res) => {
        try {
            let query = `SELECT * FROM user_complete WHERE username = ? OR email = ?`
            let check = await dbquery(query, [req.body.userOrEmail, req.body.userOrEmail])

            if (check.length !== 0 && bcrypt.compareSync(req.body.password, check[0].password)) {
                let dataForToken = {
                    id: check[0].id,
                    email: check[0].email,
                    roleId: check[0].roleId
                }

                let token = req.body.keepLogin ? createToken(dataForToken) : createToken(dataForToken, { expiresIn: '24h' })

                query = 'UPDATE users SET ? WHERE id = ?'
                await dbquery(query, [{
                    lastLogin: currentTime()
                }, check[0].id])

                delete check[0].password    //so it won't be included to response data
                res.status(200).send({ user: check[0], token })
            } else {
                res.status(404).send({ error: 'Username or password is wrong' })
            }
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    //edit user profile data (except password) by email and id gotten from token
    edit: async (req, res) => {
        try {
            let query = 'SELECT * FROM users WHERE email = ?'
            const user = await dbquery(query, [req.user.email])

            if (user.length !== 0) {

                for (const key in req.body) {
                    if (req.body[key] === '' || req.body[key] === null) req.body[key] = user[0][key]
                }

                query = 'UPDATE users SET ? WHERE id = ?'
                await dbquery(query, [{
                    ...req.body,
                    updatedTime: currentTime()
                }, user[0].id])

                res.status(200).send({ message: 'Edit success' })
            } else {
                res.status(404).send({ error: 'User not found' })
            }
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    //change user password by email and id gotten from token
    changePass: async (req, res) => {
        try {
            let query = 'SELECT * FROM users WHERE email = ?'
            const user = await dbquery(query, [req.user.email])

            const { currentPassword, newPassword } = req.body
            if (user.length !== 0 && bcrypt.compareSync(currentPassword, user[0].password)) {

                query = 'UPDATE users SET ? WHERE id = ?'
                await dbquery(query, [{
                    password: bcrypt.hashSync(newPassword, 10),
                    updatedTime: currentTime()
                }, user[0].id])

                res.status(200).send({ message: 'Edit success' })
            } else {
                res.status(400).send({ error: 'Wrong current password' })
            }
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    //function to keep user logged in by their token
    keepLogin: async (req, res) => {
        try {
            let query = `SELECT * FROM user_complete WHERE id = ? AND email = ?`
            const check = await dbquery(query, [
                req.user.id,
                req.user.email
            ])

            query = 'UPDATE users SET ? WHERE id = ?'
            await dbquery(query, [{
                lastLogin: currentTime()
            }, check[0].id])

            delete check[0].password    //so it won't be included to response data
            res.status(200).send({ user: check[0] })
        } catch (error) {
            res.status(500).send({ error })
        }
    },

    //get city list from user_cities
    cityList: async (req, res) => {
        try {
            const cities = await dbquery(`SELECT * FROM user_cities`)
            res.status(200).send(cities)
        } catch (error) {
            res.status(500).send({ error })
        }
    }

}