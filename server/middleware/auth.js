const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
	try{
		//testng with postman
		// const token = req.header('Authorization').replace('Bearer ', '')  //for postman
		// console.log(req.cookies.jwt)
		const token = req.cookies.jwt

		const decoded = jwt.verify(token, process.env.JWT_SECRET, {
			expiresIn: 60000
		})
		const user = await User.findOne({_id: decoded._id, "tokens.token": token})

		if(!user) throw new Error()

		req.token = token
		req.user = user
		next()
	}catch(err){
		console.log(err)
		res.status(401).send(err)
	}
}

module.exports = auth
