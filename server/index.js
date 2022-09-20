require('dotenv').config()
require('./db/mongoose')
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const publicPath = path.join(__dirname, '../client/public')
const viewsPath = path.join(__dirname, '../client/views')
const partialsPath = path.join(__dirname, '../client/views/partials')

const User = require('./models/user')
const Task = require('./models/task')

const app = express()
app.use(cookieParser())

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const { application } = require('express')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(publicPath))
app.use(userRouter)
app.use(taskRouter)
app.set('view engine', 'ejs')
app.set('views', viewsPath)

console.log(publicPath)

const port = process.env.PORT 	//setting up port

app.listen(port, () => {
	console.log(`Server started at Port ${port}`)
})
