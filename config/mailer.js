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
            from: 'Admin <simkalastoforka@gmail.com>',
            to: destination,
            subject: 'User Account Verification for RIG-UP!',
            text: 'Verification',
            html: `Thank you for register.<br/>Please click link verification below:<br/><a href="${process.env.FRONTEND_URL}/verifying/${token}">VERIFY</a> `
        }
    },
    welcomeEmail: (destination) => {
        return {
            from: 'Admin <simkalastoforka@gmail.com>',
            to: destination,
            subject: 'Registration Success for RIG-UP!',
            text: 'Registration Success',
            html: `<h1>WELCOME TO RIG-UP!</h1><br/>
                    <p>Thank you for joining us, and let's rig up your gear!<p>
                    <br/><br/>
                    <p>--- RIG-UP! ---</p>`
        }
    },
    transactionWaitingPaymentEmail: (destination, tr, items) => {
        return {
            from: 'Admin <simkalastoforka@gmail.com>',
            to: destination,
            subject: `Waiting Payment for ${tr.transactionCode} - RIG-UP!`,
            text: 'Notification',
            html: `<h1>Thank you for shopping!</h1><br/>
                <p>Here is your transaction detail:<p><br/>
                <ul>
                    <li>Transaction Code : ${tr.transactionCode}</li>
                    <li>Transaction Date : ${tr.transactionDate}</li>
                    <li>Delivery Address : ${tr.deliveryAddress}</li>
                    <li>Total Product : ${tr.totalProduct}</li>
                    <li>Total Quantity : ${tr.totalQuantity}</li>
                    <li>Total Price : ${tr.totalPrice}</li>
                    <li>Shipping Courier : ${tr.shippingCourier}</li>
                    <li>Shipping Cost : ${tr.shippingCost}</li>
                    <li>Total Cost : ${tr.totalCost}</li>
                    <li>Paid Status : Waiting For Payment</li>
                </ul></br>
                <table>
                    <tr>
                        <th>Product Name</th>
                        <th>Product Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                    ${items.map(i => {
                return `<tr>
                                    <td>${i.name}</td>
                                    <td>${i.productPrice}</td>
                                    <td>${i.quantity}</td>
                                    <td>${i.totalPrice}</td>
                                </tr>`
            })}
                </table></br>
                <h3>Please confirm your payment and include your transaction receipt</h3></br>
                <div>
                    <div>
                        <div>
                            <p>Bank Mandiri</p>
                            <p>PT. RIGUP INDONESIA</p>
                            <h3>0700 000 899 992</h3>
                        </div>
                    </div>
                    <div>
                        <div>
                            <p>Bank BCA</p>
                            <p>PT. RIGUP INDONESIA</p>
                            <h3>731 025 2527</h3>
                        </div>
                    </div>
                    <div>
                        <div>
                            <p>Bank BNI</p>
                            <p>PT. RIGUP INDONESIA</p>
                            <h3>023 827 2088</h3>
                        </div>
                    </div>
                </div></br>
                </br>
                <p>--- Thank you - RIG-UP! ---</p> `
        }
    },
    transactionPaymentSuccessEmail: (destination, tr, items) => {
        return {
            from: 'Admin <simkalastoforka@gmail.com>',
            to: destination,
            subject: `INVOICE - ${tr.transactionCode} - Payment Success - RIG-UP!`,
            text: 'INVOICE',
            html: `<h1>INVOICE - ${tr.transactionCode}</h1><br/>
            <p>Congratulation, payment success and has been verified.<p><br/>
            <p>Here is your transaction detail:<p><br/>
            <ul>
                <li>Transaction Code : ${tr.transactionCode}</li>
                <li>Transaction Date : ${tr.transactionDate}</li>
                <li>Delivery Address : ${tr.deliveryAddress}</li>
                <li>Total Product : ${tr.totalProduct}</li>
                <li>Total Quantity : ${tr.totalQuantity}</li>
                <li>Total Price : ${tr.totalPrice}</li>
                <li>Shipping Courier : ${tr.shippingCourier}</li>
                <li>Shipping Cost : ${tr.shippingCost}</li>
                <li>Total Cost : ${tr.totalCost}</li>
                <li>Paid Status : PAID</li>
            </ul></br>
            <table>
                <tr>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                </tr>
                ${items.map(i => {
                return `<tr>
                                <td>${i.name}</td>
                                <td>${i.productPrice}</td>
                                <td>${i.quantity}</td>
                                <td>${i.totalPrice}</td>
                            </tr>`
            })}
            </table>
            <p>--- Thank you - RIG-UP! ---</p> `
        }
    },
    transactionFailedEmail: (destination, tr, items) => {
        return {
            from: 'Admin <simkalastoforka@gmail.com>',
            to: destination,
            subject: `Transaction Failed for ${tr.transactionCode} - RIG-UP!`,
            text: 'Transaction Failed',
            html: `<h1>Transaction Failed - ${tr.transactionCode}</h1><br/>
            <p>Sorry, we cannot verify your uploaded payment receipt.<p><br/>
            <p>For further information, please contact our costumer service at 022-222222<p><br/>
            <p>or visit our shop at Jl. Entah Dimana no. XX - Jekardah Pusat<p><br/>
            <p>Here is your transaction detail:<p><br/>
            <ul>
                <li>Transaction Code : ${tr.transactionCode}</li>
                <li>Transaction Date : ${tr.transactionDate}</li>
                <li>Delivery Address : ${tr.deliveryAddress}</li>
                <li>Total Product : ${tr.totalProduct}</li>
                <li>Total Quantity : ${tr.totalQuantity}</li>
                <li>Total Price : ${tr.totalPrice}</li>
                <li>Shipping Courier : ${tr.shippingCourier}</li>
                <li>Shipping Cost : ${tr.shippingCost}</li>
                <li>Total Cost : ${tr.totalCost}</li>
                <li>Paid Status : PAYMENT VERIFICATION FAILED</li>
            </ul></br>
            <table>
                <tr>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                </tr>
                ${items.map(i => {
                return `<tr>
                                <td>${i.name}</td>
                                <td>${i.productPrice}</td>
                                <td>${i.quantity}</td>
                                <td>${i.totalPrice}</td>
                            </tr>`
            })}
            </table>
            <p>--- Thank you - RIG-UP! ---</p> `
        }
    },
    transactionItemDeliveredEmail: (destination, tr, items) => {
        return {
            from: 'Admin <simkalastoforka@gmail.com>',
            to: destination,
            subject: `Item Delivered to Destination for ${tr.transactionCode} - RIG-UP!`,
            text: 'INVOICE',
            html: `<h1>ITEM DELIVERED</h1><br/>
            <p>Here is your transaction detail:<p><br/>
            <ul>
                <li>Transaction Code : ${tr.transactionCode}</li>
                <li>Transaction Date : ${tr.transactionDate}</li>
                <li>Delivery Address : ${tr.deliveryAddress}</li>
                <li>Total Product : ${tr.totalProduct}</li>
                <li>Total Quantity : ${tr.totalQuantity}</li>
                <li>Total Price : ${tr.totalPrice}</li>
                <li>Shipping Courier : ${tr.shippingCourier}</li>
                <li>Shipping Cost : ${tr.shippingCost}</li>
                <li>Total Cost : ${tr.totalCost}</li>
                <li>Paid Status : PAID</li>
            </ul></br>
            <table>
                <tr>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                </tr>
                ${items.map(i => {
                return `<tr>
                                <td>${i.name}</td>
                                <td>${i.productPrice}</td>
                                <td>${i.quantity}</td>
                                <td>${i.totalPrice}</td>
                            </tr>`
            })}
            </table>
            <p>--- Thank you - RIG-UP! ---</p> `
        }
    },
    sendMailResetPassword: (destination, token) => {
        return {
            from: 'Admin <simkalastoforka@gmail.com>',
            to: destination,
            subject: 'Reset Password Account - RIG-UP!',
            text: 'Reset Password',
            html: `Thank you.<br/>Please click link below to reset your password:<br/><a href="${process.env.FRONTEND_URL}/resetpassword/${token}">RESET PASSWORD</a> `
        }
    },
}
