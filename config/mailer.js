const nodemailer = require('nodemailer')

module.exports = {
    transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'oauth2',
            user: 'simkalastoforka@gmail.com',
            clientId: '662913831038-vshutd3ss8613i08at2kdqhefamojknd.apps.googleusercontent.com',
            clientSecret: 'xcyzwZj9DYk1MaI2TNZCNpYg',
            refreshToken: '1//04w2vVbkoiG0gCgYIARAAGAQSNwF-L9IraFGOMBCkamOZxTcpX6k8njtqpsHZ3HZKd_jX1flvBp89FCEMEhoDRjjybJc-6TNIC_I',
        }
    }),
    verifyEmail: (destination, token) => {
        return {
            from: 'RIG-UP! Online PC RIG Store',
            to: destination,
            subject: 'User Account Verification for RIG-UP!',
            text: 'Verification',
            html: `Thank you for register.<br/>Please click link verification below:<br/><a href="http://localhost:3000/verifying/${token}">VERIFY</a> `
        }
    }
}
