const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

const auth = require('../middleware/auth')

/*create task*/
router.post('/user/tasks/create', auth, async (req, res) => {
	const task = new Task({
		...req.body,
		author: req.user._id
	})

	try{
		await task.save()
		// res.send(task)
		res.status(201)
		res.redirect('/user/dashboard')
	}catch(err){
		console.log("Task creation error")
		res.status(400)
		res.redirect('/error')
	}
})

/*update task*/
router.post('/user/tasks/update', auth, async (req, res) => {
	try{
		req.body.status = Boolean(req.body.status)
		const id = (req.body.id).toString()
		const task = await Task.findById(id)
		if(!task){
			throw new Error("Task not found.")
		}
		task.desc = req.body.desc
		task.completed = req.body.status
		await task.save()
		res.redirect('/user/dashboard')
	}catch(err) {
		console.log("Task Update error: ", err)
		res.status(500)
		res.redirect('/error')
	}
})

/*delete task*/
router.get('/user/tasks/remove/:id', auth, async (req, res) => {
	try{
		const task = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})

		if(!task){
			res.status(404)
			throw new Error("somehing went wrong :(")
		}
		res.redirect('/user/dashboard')
	}catch(err) {
		res.status(500)
		res.redirect('/error')
	}
})

/*get all tasks*/
router.get('/user/tasks/all', auth, async(req, res) => {
	try{
		const myTasks = await Task.find({author: req.user._id})
		res.send(myTasks)
	}catch(err) {
		res.status(500)
		res.redirect('/error')
	}
})

/*get completed tasks*/
router.get('/user/tasks/completed', auth, async (req, res) => {
	try{
		const myTasks = await Task.find({author: req.user._id})
		const completedTasks = myTasks.map(task => task.completed ? task : undefined)
		res.send(completedTasks)
	}catch(err){
		console.log("completed task error: ",err)
		res.redirect(500, '/error')
	}
})


/*get pending tasks*/
router.get('/user/tasks/pending', auth, async (req, res) => {
	try{
		const myTasks = await Task.find({author: req.user._id})
		const pendingTasks = myTasks.map(task => task.completed ? undefined : task)
		console.log(pendingTasks)
		res.send(pendingTasks)
	}catch(err) {
		redirect(500, '/error')
	}
})



/***************______________FOR LEARNING PURPOSE ONLY

read task
query: GET /tasks?compelted=true -> showing completed or incompleted tasks based on completed value
query: GET /tasks/limit -> pagination
query: GET /tasks?sortBy=createdAt_asc -> sorting in ascending order
query: GET /tasks?sortBy=createdAt_desc -> sorting in descending order
*/
router.get('/user/tasks', auth, async (req, res) => {
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