import React from 'react'
import '../../../node_modules/font-awesome/css/font-awesome.css'

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import { useStoreon } from 'storeon/react'
import loadable from '@loadable/component'
import Loading from '../../components/Loading'
import 'antd/dist/antd.css'
import './styles.css'
import './font.css'
import './color.css'

const SignIn = loadable(() => import('../SignIn'))
const SignUp = loadable(() => import('../SignUp'))
const HomePage = loadable(() => import('../HomePage'))
const ForgotPwd = loadable(() => import('../ForgotPwd'))
const ResetPwd = loadable(() => import('../ResetPwd'))
const Dashboard = loadable(() => import('../Dashboard'))
const Create = loadable(() => import('../Create'))
const Privacy = loadable(() => import('../Privacy'))
const Terms = loadable(() => import('../Terms'))
const Cookies = loadable(() => import('../Cookies'))
const Contact = loadable(() => import('../Contact')); 
const Testimonial = loadable(() => import('../Testimonial')); 
const User = loadable(() => import('../User'))
const Card = loadable(() => import('../Card'))
const SetPwd = loadable(() => import('../NSignup/SignUp'))
const Payment = loadable(() => import('../Payment'))
const Settings = loadable(() => import('../Settings'))
const Billing = loadable(() => import('../Settings/Billing'))
const Referral = loadable(() => import('../Settings/Referral'))
const Plan = loadable(() => import('../Settings/Plan'))
const Pricing = loadable(() => import('../Pricing'))

// const NSignUp = Loadable({
// 	loader: () => import('../NSignUp'),
// 	loading: Loading
// })
const NSignup = loadable(() => import('../NSignup'))

const theme = createMuiTheme()

export default function App() {
	const { authUser, gettingUser, dispatch } = useStoreon('authUser', 'gettingUser')

	const loadUserInfo = () => {
		dispatch('session/getUser')
	}

	// if (gettingUser) return <Loading />
	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Switch>
					<Route
						exact
						path="/"
						render={props =>
							!gettingUser ? (
								<>
									{authUser ? (
										<Create user={authUser} {...props} />
									) : (
										<HomePage {...props} />
									)}
								</>
							) : (
								<Loading />
							)
						}
					/>
					<GuestRoute authUser={authUser} exact path="/signin" component={SignIn} />
					<Route exact path="/forgot-password" component={ForgotPwd} />
					<Route exact path="/reset-password" component={ResetPwd} />
					<GuestRoute authUser={authUser} exact path="/set-password/:email" component={SetPwd} />
					<GuestRoute authUser={authUser} exact path="/signup" component={SignUp} />
					<GuestRoute authUser={authUser} exact path="/signup" component={SignUp} />
					<PrivateRoute
						authUser={authUser}
						gettingUser={gettingUser}
						exact
						path="/analytics"
						render={props => <Dashboard user={authUser} {...props} />}
					/>
					<PrivateRoute
						authUser={authUser}
						gettingUser={gettingUser}
						exact
						path="/create"
						render={props => <Create user={authUser} {...props} />}
					/>
					<GuestRoute 
						authUser={authUser} 
						exact 
						path="/newsignup" 
						render={props => (
							<NSignup user={authUser} {...props} />
						)}
					/>
					<PrivateRoute
						exact
						authUser={authUser}
						gettingUser={gettingUser}
						path="/get-card"
						render={props => (
							<Card user={authUser} {...props} loadUserInfo={loadUserInfo} />
						)}
					/>
					<GuestRoute 
						authUser={authUser} 
						exact 
						path="/order-tap-product-no-auth" 
						render={props => (
							<Payment user={authUser} {...props} />
						)}
					/>
					<PrivateRoute  
						exact 
						authUser={authUser}
						gettingUser={gettingUser}
						path="/order-tap-product" 
						render={props => (
							<Payment user={authUser} {...props} loadUserInfo={loadUserInfo} />
						)}
					/>
					<PrivateRoute 
						exact
						authUser={authUser}
						gettingUser={gettingUser}
						path="/settings"
						render={
							props => (
								<Settings user={authUser} {...props} loadUserInfo={loadUserInfo} />
							)
						}
					/>
					<PrivateRoute 
						exact
						authUser={authUser}
						gettingUser={gettingUser}
						path="/settings/billing"
						render={
							props => (
								<Billing user={authUser} {...props} loadUserInfo={loadUserInfo} />
							)
						}
					/>
					<PrivateRoute 
						exact
						authUser={authUser}
						gettingUser={gettingUser}
						path="/settings/referrals"
						render={
							props => (
								<Referral user={authUser} {...props} loadUserInfo={loadUserInfo} />
							)
						}
					/>
					<PrivateRoute 
						exact
						authUser={authUser}
						gettingUser={gettingUser}
						path="/settings/plan"
						render={
							props => (
								<Plan user={authUser} {...props} loadUserInfo={loadUserInfo} />
							)
						}
					/>
					<Route exact path="/pricing" component={Pricing} />
					<Route exact path="/privacy" component={Privacy} />
					<Route exact path="/terms" component={Terms} />
					<Route exact path="/cookies" component={Cookies} />
					<Route exact path="/contact" component={Contact} />
					<Route exact path="/testimonials" component={Testimonial} />
					<Route exact path="/:username">
						<User />
					</Route>
				</Switch>
			</Router>
		</MuiThemeProvider>
	)
}

const GuestRoute = ({ authUser, ...rest }) => {
	if (authUser) return <Redirect to="/" />
	return <Route {...rest} />
}

const PrivateRoute = ({ authUser, gettingUser, ...rest }) => {
	if (!authUser && !gettingUser) return <Redirect to="/" />
	return <Route {...rest} render={gettingUser ? () => <Loading /> : rest.render} />
}
