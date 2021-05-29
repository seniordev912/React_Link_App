const express = require('express')
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const morgan = require('morgan')
const helmet = require('helmet')
const passport = require('passport')
const bodyParser = require('body-parser')
const device = require('express-device')
const compression = require('compression')
const cors = require('cors')
const waitlist = require('../routes/waitlist')
const user = require('../routes/user')
const users = require('../routes/users')
const { IN_PROD, CLIENT_URL } = require('.')

require('./passport')(passport)

const app = express()

Sentry.init({
	dsn: "https://cd07bac0160240d5bc2f031b2a9f7d72@o456999.ingest.sentry.io/5453966",
	integrations: [
			// enable HTTP calls tracing
			new Sentry.Integrations.Http({ tracing: true }),
			// enable Express.js middleware tracing
			new Tracing.Integrations.Express({ app }),
	],

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(device.capture())
app.use(compression())
app.use(morgan('dev'))
app.use(helmet())

app.use(require('serve-static')(`${__dirname}/../../public`))

app.use(passport.initialize())


app.use(bodyParser.json())

app.use(
	bodyParser.urlencoded({
		extended: false
	})
)

if (IN_PROD) {
	app.use(
		cors({
			credentials: true,
			origin: CLIENT_URL
		})
	)
} else {
	app.use(cors())
}


// Routes
app.use('/user', user)
app.use('/users', users)
app.use('/waitlist', waitlist)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
	// The error id is attached to `res.sentry` to be returned
	// and optionally displayed to the user for support.
	res.statusCode = 500;
	res.end(res.sentry + "\n");
});

module.exports = app
