const util = require('util')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { createToken } = require('../config/jwt')
const db = require('../config/database')
const { transporter, verifyEmail, sendMailResetPassword, welcomeEmail } = require('../config/mailer');

const dbquery = util.promisify(db.query).bind(db)
const sendMail = util.promisify(transporter.sendMail).bind(transporter)
const currentTime = () => moment().utc().format('YYYY-MM-DD hh:mm:ss')

module.exports = {

    //get all users (admin only)
    getUsers: async (req, res) => {
        try {
            let query = `SELECT * FROM user_complete
                        ${req.query.limit ? `limit ? offset ?` : ''}`
            const users = await dbquery(query, [
                parseInt(req.query.limit),
                parseInt(req.query.offset)
            ])
            res.status(200).send(users)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //get all users count (admin only)
    getCountUsers: async (req, res) => {
        try {
            let query = `SELECT count(*) as count FROM user_complete`
            const count = await dbquery(query)
            res.status(200).send(count[0])
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //delete user by id (admin only)
    deleteById: async (req, res) => {
        try {
            await dbquery('DELETE FROM users WHERE id = ?', [req.params.id])
            await dbquery('DELETE FROM user_carts WHERE userId = ?', [req.params.id])
            res.status(200).send({ message: 'User deleted successfully' })
        } catch (error) {
            res.status(500).send(error)
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
                    roleId: 2,
                    verified: 0
                })

                query = 'SELECT * FROM user_complete WHERE id = ?'
                const user = await dbquery(query, [insert.insertId])

                let verificationToken = createToken({
                    id: user[0].id,
                    email: user[0].email,
                    roleId: user[0].roleId,
                    verified: user[0].verified
                }, { expiresIn: '1h' })

                let mailOptions = verifyEmail(req.body.email, verificationToken)
                console.log(mailOptions)
                const result = await sendMail(mailOptions)

                if (result.accepted) {
                    delete user[0].roleId
                    res.status(200).send({ user: user[0] })
                } else {
                    res.status(500).send({ message: 'cannot send email verification' })
                }
            } else {
                res.status(400).send({ message: 'Username or email exist' })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //login function with email/username and password
    login: async (req, res) => {
        try {
            console.log(req.body.userOrEmail)
            let query = `SELECT * FROM user_complete WHERE username = ? OR email = ?`
            let user = await dbquery(query, [req.body.userOrEmail, req.body.userOrEmail])
            console.log(user)
            if (user.length !== 0 && bcrypt.compareSync(req.body.password, user[0].password)) {
                let dataForToken = {
                    id: user[0].id,
                    email: user[0].email,
                    roleId: user[0].roleId,
                    verified: user[0].verified
                }

                let token = req.body.keepLogin ? createToken(dataForToken) : createToken(dataForToken, { expiresIn: '12h' })

                query = 'UPDATE users SET ? WHERE id = ?'
                await dbquery(query, [{
                    lastLogin: currentTime()
                }, user[0].id])

                delete user[0].password    //so it won't be included to response data
                res.status(200).send({ user: user[0], token })
            } else {
                res.status(404).send({ message: 'Username or password is wrong' })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //login function with email/username and password
    loginByGoogle: async (req, res) => {
        try {
            let query = `SELECT * FROM user_complete WHERE email = ?`
            let user = await dbquery(query, [req.user.email])
            if (user.length === 0) {
                let hash = bcrypt.hashSync(req.user.sub, 10)

                query = 'INSERT INTO users SET ?'
                let insert = await dbquery(query, {
                    fullname: req.user.name,
                    username: req.user.given_name,
                    email: req.user.email,
                    password: hash,
                    createdTime: currentTime(),
                    roleId: 2,
                    verified: 1
                })

                query = `SELECT * FROM user_complete WHERE id = ?`
                user = await dbquery(query, [insert.insertId])

                let token = createToken({
                    id: insert.insertId,
                    email: req.user.email,
                    roleId: 2,
                    verified: 1,
                    tokenGoogle: req.user.tokenGoogle
                })

                let mailOptions = welcomeEmail(req.user.email)
                await sendMail(mailOptions)

                delete user[0].password    //so it won't be included to response data
                res.status(200).send({ user: user[0], token })
            } else {
                if (bcrypt.compareSync(req.user.sub, user[0].password)) {
                    query = 'UPDATE users SET ? WHERE id = ?'
                    await dbquery(query, [{
                        lastLogin: currentTime()
                    }, user[0].id])
                    let token = createToken({
                        id: user[0].id,
                        email: req.user.email,
                        roleId: 2,
                        verified: 1,
                        tokenGoogle: req.user.tokenGoogle
                    })
                    res.status(200).send({ user: user[0], token })
                } else {
                    res.status(400).send({ message: 'Email has been registered, please login using password instead.' })
                }
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //edit user own data
    edit: async (req, res) => {
        try {
            let query = 'UPDATE users SET ? WHERE id = ?'
            const result = await dbquery(query, [{
                fullname: req.body.fullname,
                genderId: req.body.genderId,
                address: req.body.address,
                cityId: req.body.cityId,
                phone: req.body.phone,
                updatedTime: currentTime()
            }, req.user.id])

            query = `SELECT * FROM user_complete WHERE id = ?`
            let user = await dbquery(query, [req.user.id])

            delete user[0].password    //so it won't be included to response data
            res.status(200).send({ user: user[0] })
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //edit user data by admin only
    editByAdmin: async (req, res) => {
        try {
            let query = 'UPDATE users SET ? WHERE id = ?'
            const result = await dbquery(query, [{
                fullname: req.body.fullname,
                genderId: req.body.genderId,
                username: req.body.username,
                address: req.body.address,
                cityId: req.body.cityId,
                phone: req.body.phone,
                updatedTime: currentTime()
            }, req.params.id])

            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //edit user own password
    changePass: async (req, res) => {
        try {
            let query = 'SELECT * FROM users WHERE id = ?'
            const user = await dbquery(query, [req.user.id])
            const { currentPassword, newPassword } = req.body

            if (user.length !== 0 && bcrypt.compareSync(currentPassword, user[0].password)) {

                query = 'UPDATE users SET ? WHERE id = ?'
                await dbquery(query, [{
                    password: bcrypt.hashSync(newPassword, 10),
                    updatedTime: currentTime()
                }, req.user.id])

                query = `SELECT * FROM user_complete WHERE id = ?`
                let user = await dbquery(query, [req.user.id])

                delete user[0].password    //so it won't be included to response data
                res.status(200).send({ user: user[0] })
            } else {
                res.status(400).send({ message: 'Wrong current password' })
            }
        } catch (error) {
            res.status(500).send(error)
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
            res.status(500).send(error)
        }
    },

    //get city list from user_cities
    cityList: async (req, res) => {
        try {
            const cities = await dbquery(`SELECT * FROM cities`)
            res.status(200).send(cities)
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //verifyEmailRegistration
    verifyEmail: async (req, res) => {
        let query = `SELECT * FROM user_complete WHERE id = ? AND email = ?`
        const user = await dbquery(query, [
            req.user.id,
            req.user.email
        ])

        query = 'UPDATE users SET ? WHERE id = ?'
        await dbquery(query, [{
            verified: 1,
            lastLogin: currentTime()
        }, user[0].id])

        let dataForToken = {
            id: user[0].id,
            email: user[0].email,
            roleId: user[0].roleId,
            verified: 1
        }

        let token = createToken(dataForToken, { expiresIn: '12h' })

        let mailOptions = welcomeEmail(req.user.email)
        console.log(mailOptions)
        await sendMail(mailOptions)

        delete user[0].password    //so it won't be included to response data
        res.status(200).send({ user: { ...user[0], verified: 1 }, token })
    },

    //resendVerifyEmailRegistration
    resendVerifyEmail: async (req, res) => {
        try {
            let query = 'SELECT * FROM user_complete WHERE id = ? AND email = ?'
            const user = await dbquery(query, [req.body.id, req.body.email])

            if (user.length !== 0) {

                let verificationToken = createToken({
                    id: user[0].id,
                    email: user[0].email,
                    roleId: user[0].roleId,
                    verified: user[0].verified
                }, { expiresIn: '1h' })

                let mailOptions = verifyEmail(req.body.email, verificationToken)
                const result = await sendMail(mailOptions)

                if (result.accepted) {
                    delete user[0].roleId
                    res.status(200).send({ user: user[0] })
                } else {
                    res.status(500).send({ message: 'cannot send email verification' })
                }
            } else {
                res.status(404).send({ message: 'email not found' })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //sendMailResetPassword
    sendResetPassword: async (req, res) => {
        try {
            console.log(req.body)
            let query = `select * from user_complete where email = ?`
            const user = await dbquery(query, [req.body.email])
            if (user.length !== 0) {
                console.log(user)
                let token = createToken({
                    id: user[0].id,
                    email: user[0].email,
                    roleId: user[0].roleId,
                    verified: user[0].verified
                }, { expiresIn: '1h' })
                let mailOptions = sendMailResetPassword(req.body.email, token)
                const result = await sendMail(mailOptions)
                console.log(result)
                if (result.accepted) {
                    delete user[0].roleId
                    res.status(200).send({ user: user[0] })
                } else {
                    res.status(500).send({ message: 'cannot send email verification' })
                }
            } else {
                res.status(404).send({ message: 'email not found' })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    },

    //resetPassword
    resetPassword: async (req, res) => {
        try {
            console.log(req.user)
            let query = `select * from user_complete where id = ? and email = ?`
            const user = await dbquery(query, [req.user.id, req.user.email])
            if (user.length !== 0) {
                console.log(user)
                query = 'UPDATE users SET ? WHERE id = ?'
                const result = await dbquery(query, [{
                    password: bcrypt.hashSync(req.body.password, 10),
                    updatedTime: currentTime()
                }, user[0].id])
                console.log(result)
                res.status(200).send(result)

            } else {
                res.status(404).send({ message: 'user not found' })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }

}