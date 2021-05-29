const setConnection  = require('./config/database')
const app = require('./config/express')
require('dotenv').config()
const { PORT } = require('./config')

setConnection()

app.listen(PORT, () => {
	console.info(`Server is listening to port ${PORT}`)
})
