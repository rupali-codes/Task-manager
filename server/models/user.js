const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		validate: (value) => {
			if(!validator.isAlpha(value, 'en-US', {ignore: ' '})){
				throw new Error("Please enter a valid name")
			}
		}
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		validate: (value) => {
			if(!validator.isEmail(value)){
				throw new Error("Invalid email")
			}
		},
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 7,
		trime: true,
		validate: (value) => {
			if(value.toLowerCase().includes('password')){
				throw new Error("Invalid password")
			}
		}
	},
	age: {
		type: Number,
		default: 0,
		validate:  (value) => {
			if(value < 0){
				throw new Error("age must be a positive number")
			}
		}
	},
	avatar: {
		type: Buffer
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}]
	
}, {
	timestamps: true
})

userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'author'
})

//public user profile
userSchema.methods.toJSON = function() {
	const userObj = this.toObject()

	delete userObj.password
	delete userObj.avatar
	delete userObj.tokens

	return userObj
}


// generating tokens for user
userSchema.methods.generateAuthToken = async function() {
	const token = jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET) //generating token

	this.tokens = this.tokens.concat({token}) //pushing new token into tokens array
	await this.save()
	return token
}

//creating our own functions
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({email})

	if(!user){
		throw new Error("User does not exist")
	}

	const isMatch = await bcrypt.compare(password, user.password)

	if(!isMatch){
		throw new Error("Incorrect password")
	}

	return user
}

// hash plain text passowrd before saving
userSchema.pre('save', async function(next){
	const user = this
	if(user.isModified('password')){
		user.password = await bcrypt.hash(user.password, 8)
	}
	next()
})

//deleting user tasks when user logged out
userSchema.pre('remove', async function(next){
	await Task.deleteMany({author: this._id})

	next()
})

const User = mongoose.model('User', userSchema)

module.exports = User