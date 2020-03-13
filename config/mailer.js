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
            html: `Thank you for register.<br/>Please click link verification below:<br/><a href="http://localhost:3000/verifying/${token}">VERIFY</a> `
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
                    <li>Transaction Date : ${tr.tDate}</li>
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
                    ${items.map(i=> {
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
                            <h3>0700 000 899 992</h3>
                        </div>
                    </div>
                    <div>
                        <div>
                            <p>Bank BCA</p>
                            <h3>731 025 2527</h3>
                        </div>
                    </div>
                    <div>
                        <div>
                            <p>Bank BNI</p>
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
            subject: `Payment Success for ${tr.transactionCode} - RIG-UP!`,
            text: 'INVOICE',
            html: `<h1>PAYMENT SUCCESS</h1><br/>
            <p>Here is your transaction detail:<p><br/>
            <ul>
                <li>Transaction Code : ${tr.transactionCode}</li>
                <li>Transaction Date : ${tr.tDate}</li>
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
                ${items.map(i=> {
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
    }
}
