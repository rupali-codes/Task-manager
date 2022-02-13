require('./db/mongoose')
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const { application } = require('express')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(publicPath))
app.use(cookieParser)

app.set('view engine', 'hbs')
app.set('views', viewsPath)

hbs.registerPartials(partialsPath)

module.exports = app
