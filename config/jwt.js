const jwt = require('jsonwebtoken')

module.exports = {
    createToken: (data) => jwt.sign(data, process.env.SECRET_KEY),
    verifyUser: (req, res, next) => {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY, (error, decoded) => {
                if (error) {
                    res.status(400).send({ message: 'You are not authorized', error })
                } else if (decoded.iat + (60 * 60 * 12) < Math.floor(Date.now() / 1000)) {
                    res.status(400).send({ message: 'Your session is expired' })
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
                console.log(decoded)
                if (error || decoded.role_id !== 1) {
                    res.status(400).send({ message: 'You are not authorized' })
                } else if (decoded.iat + (60 * 60 * 12) < Math.floor(Date.now() / 1000)) {
                    res.status(400).send({ message: 'Your session is expired' })
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