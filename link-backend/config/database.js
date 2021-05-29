const mongoose = require('mongoose')
const { MONGODB_URI } = require('.')

module.exports = function() {
	mongoose.Promise = global.Promise
	mongoose
		.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		})
		.then(() => console.log('MongoDB is connected!'))
		.catch(err => console.log(err))
}

