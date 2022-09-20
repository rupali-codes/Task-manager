const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true
}).then(res => console.log("connected successfully")).catch(err => console.log("Error"))
 