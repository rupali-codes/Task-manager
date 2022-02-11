
const app = require('./app')
const port = process.env.PORT//setting up an heroku port

app.listen(port, () => {
	console.log(`Server started at Port ${port}`)
})





