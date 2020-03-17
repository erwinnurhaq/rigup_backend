const jwt = require('jsonwebtoken')
const axios = require('axios')
const secret = process.env.SECRET_KEY

module.exports = {
    createToken: (data, option) => jwt.sign(data, secret, option),
    verifyUser: (req, res, next) => {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization.split(' ')[1], secret, (error, decoded) => {
                if (error || decoded.verified !== 1) {
                    res.status(400).send({ message: 'You are not authorized', error })
                } else if (decoded.tokenGoogle) {
                    axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${decoded.tokenGoogle}`)
                        .then(response => {
                            req.user = decoded
                            next()
                        })
                        .catch(error => {
                            res.status(400).send({ message: 'Expired or Invalid Token', error })
                        })
                } else {
                    req.user = decoded
                    next()
                }
            })
        } else {
            res.status(400).send({ message: 'You are not authorized' })
        }
    },
    verifyAdmin: (req, res, next) => {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization.split(' ')[1], secret, (error, decoded) => {
                if (error || decoded.roleId !== 1 || decoded.verified !== 1) {
                    res.status(400).send({ message: 'You are not authorized' })
                } else {
                    req.user = decoded
                    next()
                }
            })
        } else {
            res.status(400).send({ message: 'You are not authorized' })
        }
    },
    verifyEmail: (req, res, next) => {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization.split(' ')[1], secret, (error, decoded) => {
                if (error) {
                    res.status(400).send({ message: 'Expired or Invalid Token' })
                } else {
                    req.user = decoded
                    next()
                }
            })
        } else {
            res.status(400).send({ message: 'Expired or Invalid Token' })
        }
    },
    verifyGoogle: (req, res, next) => {
        if (req.headers.authorization) {
            let tokenGoogle = req.headers.authorization.split(' ')[1]
            axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenGoogle}`)
                .then(response => {
                    req.user = { ...response.data, tokenGoogle }
                    next()
                })
                .catch(error => {
                    res.status(400).send({ message: 'Expired or Invalid Token', error })
                })
        } else {
            res.status(400).send({ message: 'Expired or Invalid Token' })
        }
    }
}