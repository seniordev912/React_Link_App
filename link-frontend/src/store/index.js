import { createStoreon } from 'storeon'
import { 
	storeonDevtools, 
	// storeonLogger 
} from 'storeon/devtools'
import session from './session'
import button from './button'
import buttons from './buttons'
import dragStatus from './dragStatus'
import users from './users'
import card from './card'
import socials from './socials'

const store = createStoreon([
	session,
	button,
	buttons,
	dragStatus,
	users,
	card,
	socials,
	process.env.NODE_ENV === 'development' && storeonDevtools
	// process.env.NODE_ENV === 'development' && storeonLogger
])

export default store
