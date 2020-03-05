const jwt = require('jsonwebtoken')
const secret = process.env.SECRET_KEY || 'asdf1234zxc.'

module.exports = {
    createToken: (data, option) => jwt.sign(data, secret, option),
    verifyUser: (req, res, next) => {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization.split(' ')[1], secret, (error, decoded) => {
                if (error) {
                    res.status(400).send({ message: 'You are not authorized', error })
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
                if (error || decoded.roleId !== 1) {
                    console.log(decoded.roleId)
                    res.status(400).send({ message: 'You are not authorized' })
                } else {
                    req.user = decoded
                    next()
                }
            })
        } else {
            res.status(400).send({ message: 'You are not authorized' })
        }
    }
}