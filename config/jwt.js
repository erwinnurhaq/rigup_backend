const jwt = require('jsonwebtoken')

module.exports = {
    createToken: (data, duration) => jwt.sign(data, process.env.SECRET_KEY, duration),
    verifyUser: (req, res, next) => {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY, (error, decoded) => {
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
            jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY, (error, decoded) => {
                if (error || decoded.role_id !== 1) {
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