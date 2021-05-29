const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sender = process.env.SENDGRID_SENDER

exports.sendSignEmail = async function(req, { to }) {
    const msg = {
        to,
        from: sender,
        templateId: 'd-11f02b477a62463fa0177397286c7474'
    }
    
    await sgMail.send(msg).then(() => {
			console.log("success")
		}).catch(err => {
			console.log("err", err)
		})
}
