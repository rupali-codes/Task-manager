const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

const auth = require('../middleware/auth')

/*create task*/
router.post('/tasks', auth, async (req, res) => {
	const task = new Task({
		...req.body,
		author: req.user._id
	})

	try{
		await task.save()
		res.send(task)
	}catch(err){
		res.status(400).send()
	}
})

/*
read task
query: GET /tasks?compelted=true -> showing completed or incompleted tasks based on completed value
query: GET /tasks/limit -> pagination
query: GET /tasks?sortBy=createdAt_asc -> sorting in ascending order
query: GET /tasks?sortBy=createdAt_desc -> sorting in descending order
*/
router.get('/tasks', auth, async (req, res) => {
	const match = {}
	const sort = {}

	if(req.query.completed){
		match.completed = req.query.completed === 'true'
	}
	if(req.query.sortBy){
		const parts = req.query.sortBy.split('_')
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
	}

	try{
		await req.user.populate({
			path: 'tasks',
			match,
			options: {
				limit: !parseInt(req.query.limit) ? undefined : parseInt(req.query.limit),
				skip: !parseInt(req.query.skip) ? undefined : parseInt(req.query.skip),
				sort
			}
		})
		res.send(req.user.tasks)
	}catch(err){
		console.log(err)
		res.status(500).send()
	}
})

/*read task by id*/
router.get('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id

	try{		
		const task = await Task.findOne({_id, author: req.user._id})

		if(!task){
			return res.status(404).send()
		}
		res.send(task)
	}catch(err){
		res.status(500).send()
	}
})

/*update task*/
router.patch('/tasks/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowUpdates = ['title', 'desc', 'completed']

	const includes = updates.every((update) => allowUpdates.includes(update))

	if(!includes) return res.status(404).send({"ERRROR": "Invalid input"})

	try{
		const task = await Task.findOne({_id: req.params.id, author: req.user._id})

		if(!task)
			return task.status(404).send()

		updates.forEach((update) => task[update] = req.body[update])
		await task.save()
		res.send(task)
	}catch(err){
		console.log(err)
		res.status(400).send()
	}
})

/*delete*/
router.delete('/tasks/:id', auth, async (req, res) => {
	try{
		const task = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})

		if(!task) return Task.status(404).send()

		res.send(task)
	}catch(err){
		res.status(500).send()
	}
})

module.exports = router