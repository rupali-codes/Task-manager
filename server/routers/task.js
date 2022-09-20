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
		res.status(201)
		res.redirect('/user/dashboard')
	}catch(err){
		console.log("Task creation error")
		res.status(400)
		res.redirect(`/error/${err.message}`)
	}
})

/*updating task*/
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
		res.redirect(`/error/${err.message}`)
	}
})

/*deleting task*/
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
		res.redirect(`/error/${err.message}`)
	}
})

/*get all tasks*/
router.get('/user/tasks/all', auth, async(req, res) => {
	try{
		const myTasks = await Task.find({author: req.user._id})
		res.send(myTasks)
	}catch(err) {
		res.status(500)
		res.redirect(`/error/${err.message}`)
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

module.exports = router

