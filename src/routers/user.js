const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const base64 = require('base64-arraybuffer')

/*functions*/
/*uploading images*/
const upload = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb){
		if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
			return cb(new Error("please upload a valid img"))
		}
		cb(undefined, true)
	}
})

/*encoding image*/
const encodeAvatar = (buffer) =>  base64.encode(buffer)

/*create cookie*/
const createCookie = (name, value, mintues) => {
	if(minutes) {
		const date = new Date()
		date.setTime(date.getTime() + (minutes * 60 * 1000))
		const expires = "; expires="+date.toGMTString()
	}else{
		const expires = ""
	}
}

/*pages*/
router.get('/', (req, res) => {
	res.render('index')
})

router.get('/user/signup', (req, res) => {
	res.render('signup')
})

router.get('/user/login', (req, res) => {
	res.render('login')
})

router.get('/error/:err', (req, res) => {
	const err = req.params.err
	console.log("ERROR: ",err)
	res.render('error', {
		err
	})
})

router.get('/user/dashboard', auth, (req, res) => {
	res.render('dashboard', {
		name: req.user.name,
		avatar: encodeAvatar(req.user.avatar)
	})
})

/*signup*/
router.post('/user/signup', upload.single('avatar'), async (req, res) => {
	try{
		const user = new User(req.body)
		if(req.file){
			const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
			user.avatar = buffer
		}
		const token = await user.generateAuthToken()

		await user.save()

		//setting-up cookie
		res.cookie("jwt", token)
		res.status(201)
		res.redirect('login')
	}catch(err) {
		// console.log((err.message).toString().substring(0, 23))
		res.status(500)
		res.redirect('/error/'+(err.message).toString().substring(0, 22))
	}
})

/*update profile*/
router.post('/user/updateProfile', upload.single('avatar'), auth, async (req, res) => {
	try{
		req.user.name = req.body.name ? req.body.name : req.user.name
		req.user.email = req.body.email ? req.body.email : req.user.email
		req.user.password = req.body.password ? req.body.password : req.user.password

		console.log(req.file)
		if(req.file){
			const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
			req.user.avatar = buffer
		}else{
			req.user.avatar = req.user.avatar
		}
		req.user.save()
		res.redirect('/user/dashboard')
	}catch(err) {
		console.log(err)
		res.status(500)
		res.redirect('/error/'+(err.message).toString().substring(0, 22))
	}
})

/*loging in*/
router.post('/user/login',async (req, res) => {
	try{
		const user = await User.findByCredentials(req.body.email, req.body.password)

		const token = await user.generateAuthToken()

		res.cookie("jwt", token)
		res.redirect('/user/dashboard')
	}catch(err){
		res.status(404)
		res.redirect('/error/'+(err.message).toString().substring(0, 22))
	}
})

/*loging out*/
router.post('/user/logout', auth, async (req, res) => {
	try{
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token
		})
		res.clearCookie('jwt')
		await req.user.save()
		// res.send() //for postman
		res.redirect('/user/login')
	}catch(err){
		console.log("logout error: ", err)
		res.status(500)
		res.redirect('/error/'+(err.message).toString().substring(0, 22))
	}
})

/*lougout all*/
router.post('/user/logoutAll', auth, async (req, res) => {
	try{	
		req.user.tokens = []
		await req.user.save()
		// res.send() //for postman
		res.redirect('login')
	}catch(err){
		console.log(err)
		res.status(500).send()
	}
})

/************************______________FOR LEARNING PURPOSE ONLY*/

/*read profile*/
router.get('/user/me', auth, async (req, res) => {
	// res.send(req.user) //for postman
	res.render('dashboard')
})

/*read a particular document*/
router.get('/user/:id', async (req, res) => {
	const _id = req.params.id  //returns parameters of the provided url

	try{
		const user = await User.findById(_id)
		if(!user){
			return res.status(400).send()
		}
		res.send(user)
	}catch(err){
		res.status(500).send()
	}
})

/*update*/
router.patch('/user/me', auth, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowUpdates = ['name', 'email', 'password', 'age']

	const includes = updates.every((update) => allowUpdates.includes(update))

	if(!includes){
		return res.status(404).send({"Error":"invalid input"})
	}
	try{
		const user = req.user
		updates.forEach((update) => user[update] = req.body[update])

		await user.save()

		res.send(user)
	}catch(err){
		res.status(400).send(err)
	}
})	

/*delete*/
router.delete('/user/me', auth, async (req, res) => {
	const id = req.user._id

	try{
		await req.user.remove()
		res.send(req.user)
	}catch(err){
		res.status(404).send()
	}
})

router.post('/user/me/avatar',auth, upload.single('avatar'), async (req, res) => {
	const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
	req.user.avatar = buffer

	await req.user.save()
	res.send()
},(error, req, res, next) => {
	res.status(400).send({Error: error.message})
})

router.delete('/user/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined

	await req.user.save()
	res.send()
})

router.get('/user/:id/avatar', async (req, res) => {
	try{
		const user = await User.findById(req.params.id)

		if(!user || !user.avatar){
			throw new Error("somehing went wrong")
		}

		res.set('Content-Type', 'image/png')
		res.send(user.avatar)
	}catch(err){
		res.status(404).send()
	}
})

module.exports = router