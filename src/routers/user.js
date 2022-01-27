const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')


/*create*/
/*sign up*/
router.post('/users', async (req, res) => {
	const user = new User(req.body)

	try{
		await user.save()

		const token = await user.generateAuthToken()

		res.status(201).send({user, token})
	}catch(err){
		res.status(400).send()
	}
})

/*loging in*/
router.post('/users/login',async (req, res) => {
	try{
		const user = await User.findByCredentials(req.body.email, req.body.password)

		const token = await user.generateAuthToken()

		res.send({user, token})
	}catch(err){
		res.status(400).send()
		console.log(err)
	}
})
/*loging out*/
router.post('/users/logout', auth, async (req, res) => {
	try{
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token
		})

		await req.user.save()
		res.send()
	}catch(err){
		res.status(500).send()
	}
})

/*lougout all*/
router.post('/users/logoutAll', auth, async (req, res) => {
	try{	
		req.user.tokens = []
		await req.user.save()
		res.send()
	}catch(err){
		console.log(err)
		res.status(500).send()
	}
})


/*read profile*/
router.get('/users/me', auth, async (req, res) => {
	res.send(req.user)
})

/*read a particular document*/
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/me', auth, async (req, res) => {
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
router.delete('/users/me', auth, async (req, res) => {
	const id = req.user._id

	try{
		await req.user.remove()
		res.send(req.user)
	}catch(err){
		res.status(404).send()
	}
})

/* uploading avatar/profile pic */
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

router.post('/users/me/avatar',auth, upload.single('avatar'), async (req, res) => {
	const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
	req.user.avatar = buffer

	await req.user.save()
	res.send()
},(error, req, res, next) => {
	res.status(400).send({Error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined

	await req.user.save()
	res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
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