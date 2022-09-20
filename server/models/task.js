const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	}, 
	desc: {
		type: String,
		required: true,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	author: {
		type: mongoose.Schema.Types.ObjectID,
		required: true,
		ref: 'User'
	}
}, {
	timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
