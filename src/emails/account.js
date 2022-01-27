/*
	STEPS TO BE FOLLOWED
	* create a send grid account
	* go to web api
	* generate API key and follow all other steps
	* run your node app.
*/

const sgMail = require('@sendgrid/mail')

const sendGridAPIKey = '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'

sgMail.setApiKey(sendGridAPIKey)

sgMail.send({
	to: 'missrupalitheniavegirl@gmail.com',
	from: 'missrupalitheniavegirl@gmail.com',
	subject: 'This email is from Nodejs Task app',
	text: 'I hope this email is get send to you perfectly.',
})