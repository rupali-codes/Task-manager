/*for testing only*/

require('./db/mongoose')
const express = require('express')
const app = express()

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const { application } = require('express')

app.use(userRouter)
app.use(taskRouter)

module.exports = app
