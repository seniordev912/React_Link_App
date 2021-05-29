import React, { useState, useEffect } from 'react'
import { Typography, Grid, Paper } from '@material-ui/core'
import { Input } from 'antd'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useStoreon } from 'storeon/react'
import MetaTags from 'react-meta-tags'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from '../../constants/axios'
import Footer from '../../components/Footer'
import Facebook from '../../assets/icons/facebook.svg'
import Google from '../../assets/icons/google.svg'
import linkupIcon from '../../components/Navigation/images/linkup_icon.png'
import './index.css'
import SignIcon from '../../components/Sign/SignIcon'
import { SignButton, SignSocialButton } from '../../components/Sign/SignButton'
// import InstagramLogin from 'react-instagram-login'
import SocialMetaImg from '../../assets/images/meta-social.png'

const styles = theme => ({
	palette: {
		primary: '#3aa3ae'
	},
	main: {
		marginTop: '7%',
		marginRight: '3%',
		marginLeft: '3%'
	},
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${
			theme.spacing(3)
		}px`,
		width: 400
	},
	form: {
		width: '85%', // Fix IE 11 issue.
		marginTop: '40px',
		marginBottom: '30px'
	}
})

function useQuery() {
	return new URLSearchParams(useLocation().search);
 }

function SignUp(props, user) {
	const { classes } = props;
	let query = useQuery();
	let userFrom = query.get("username");

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [username, setUsername] = useState(userFrom)
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [referralCode, setReferralCode] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [order, setOrder] = useState(false)
	const { dispatch } = useStoreon('authUser')

	const signUp = async () => {

		setLoading(true)
		if (email === '' || password === '' || username === '' || firstName === '') {
			setLoading(false)
			setError('Input all required fields correctly')
			return
		}
		try {
			const input_data = {
				email,
				password,
				firstName,
				username,
				lastName,
				cardOrder: false
				// referralCode: referralCode !== '' ? referralCode : undefined
			}
			const { data } = await axios.post('user/auth/signup', input_data)
			axios.defaults.headers.authorization = `Bearer ${data.token}`
			data.user.order = true
			data.user.firstSignUp = true
			if(queryString.parse(props.location.search).plan === 'pro') {
				data.user.plan = 'pro'
			}
			dispatch('session/set', data.user)
			localStorage.setItem('token', data.token)
			setLoading(false)
		} catch (err) {
			if (err.response.data && err.response.data.error) {
				setLoading(false)
				setError(err.response.data.error)
			}
		}
	}
	const handleGoogle = async res => {
		const { data } = await axios.post('user/auth/google', {
			access_token: res.accessToken
		})
		axios.defaults.headers.authorization = `Bearer ${data.token}`
		localStorage.setItem('token', data.token)
		dispatch('session/set', data.user)
	}
	const handleFacebook = async res => {
		const { data } = await axios.post('user/auth/facebook', {
			access_token: res.accessToken
		})
		axios.defaults.headers.authorization = `Bearer ${data.token}`
		localStorage.setItem('token', data.token)
		dispatch('session/set', data.user)
	}

	// const handleTwitter = async (err, res) => {
	// 	const { data } = await axios.post('user/auth/twitter', res)
	// 	localStorage.setItem('token', data.token)
	// 	dispatch('session/set', data.user)
	// }
	let errorTimeout
	useEffect(() => {
		if (errorTimeout) {
			clearTimeout(errorTimeout)
		}
		errorTimeout = setTimeout(() => {
			setError('')
		}, 5000)
	}, [error])

	useEffect(() => {
		const newScript = document.createElement('script')
		newScript.type = 'text/javascript'
		newScript.async = true
		newScript.innerHTML =
			'!function(d,s,c){s=d.createElement(\'script\');s.src=\'https://widget.indemand.ly/launcher.js\';s.onload=function(){indemandly=new Indemandly({domain:\'david-phan\'})};c=d.getElementsByTagName(\'script\')[0];c.parentNode.insertBefore(s,c)}(document)'
		document.head.appendChild(newScript)
		setUsername(localStorage.getItem('username'));
		localStorage.removeItem('username')
		return () => {
			document.head.removeChild(newScript)
		}
	}, [])

	return (
		<main className={classes.main}>
			<MetaTags>
				<meta name="title" content="LinkUp - All your links in one place" />
				<meta name="description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta name="image" content={SocialMetaImg} />

				<meta itemProp="title" content="LinkUp - All your links in one place" />
				<meta itemProp="description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta itemProp="image" content={SocialMetaImg} />

				<meta name="twitter:title" content="LinkUp - All your links in one place" />
				<meta name="twitter:description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta name="twitter:image" content={SocialMetaImg} />

				<meta property="fb:title" content="LinkUp - All your links in one place" />
				<meta property="fb:description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta property="fb:image" content={SocialMetaImg} />
			</MetaTags>

			<Grid container justify="center" alignItems="center">
				<Paper className={classes.paper}>
					<Link to="/">
						<img src={linkupIcon} className="linkup-icon" alt="linkup" />
					</Link>
					<Typography component="h1" variant="h5" className="">
						Sign Up
					</Typography>

					<form
						name="signup"
						initialvalues={{ remember: true }}
						className={classes.form}
						onSubmit={e => {
							e.preventDefault()
							signUp()
						}}
					>
						<Typography component="p" variant="subtitle1" style={{ marginBottom: '10px' }}>
							Username
						</Typography>
						<Input
							style={{ marginBottom: '18px' }}
							placeholder="Username"
							id="username"
							name="username"
							autoComplete="on"
							autoFocus
							className="formInput"
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
						<Typography component="p" variant="subtitle1" style={{ marginBottom: '10px' }}>
							First name
						</Typography>
						<Input
							style={{ marginBottom: '18px' }}
							placeholder="Bill"
							id="firstName"
							name="firstName"
							required
							autoComplete="on"
							className="formInput"
							value={firstName}
							onChange={e => setFirstName(e.target.value)}
						/>
						<Typography component="p" variant="subtitle1" style={{ marginBottom: '10px' }}>
							Last name
						</Typography>
						<Input
							style={{ marginBottom: '18px' }}
							placeholder="Gates"
							id="lastName"
							name="lastName"
							autoComplete="on"
							className="formInput"
							value={lastName}
							onChange={e => setLastName(e.target.value)}
						/>

						<Typography component="p" variant="subtitle1" style={{ marginBottom: '10px' }}>
							Email
						</Typography>
						<Input
							style={{ marginBottom: '18px' }}
							placeholder="bill@gates.com"
							id="email"
							type="email"
							name="email"
							required
							autoComplete="on"
							className="formInput"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<Typography component="p" variant="subtitle1" style={{ marginBottom: '10px' }}>
							Password
						</Typography>
						<Input.Password
							style={{ marginBottom: '18px' }}
							placeholder="Password"
							id="password"
							name="password"
							autoComplete="on"
							className="formInput"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>

						{/* <Typography
							component="p"
							variant="p"
							style={{ marginBottom: '10px' }}
						>
							Referral code
						</Typography>
						<Input
							placeholder="Have a referral code? Add it here"
							name="referralCode"
							type="referralCode"
							id="referralCode"
							autoComplete="off"
							className="formInput"
							value={referralCode}
							onChange={e => setReferralCode(e.target.value)}
						/> */}

						{/* <Checkbox
							className="order-checkbox"
							onChange={e => setOrder(e.target.checked)}
						>
							Order platinum card for $20.00
						</Checkbox> */}

						{/* <Link className="textButton" to="/forgot-password">
							Forgot Password?
						</Link> */}

						{error && (
							<div className="errorText">
								{typeof error === 'object' && typeof error.length !== 'undefined'
									? error.map(message => <p key={message}>{message}</p>)
									: error}
							</div>
						)}

						<SignButton htmlType="submit" loading={loading}>
							Sign Up
						</SignButton>
						{/* <button type="submit" className="ant-btn submit ant-btn-submit">
								Sign Up
							</button> */}
						{/* <Button type="submit" onClick={SignUp} className="submit">
								Sign up
							</Button> */}
						<GoogleLogin
							clientId="625799337149-lsii2ae1u7bjvr3psohm5k4533vrf3vf.apps.googleusercontent.com" // google client id
							// clientId="1014050097178-jgrecianr45gh1de7i8pqdr8pof9kdke.apps.googleusercontent.com" // google client id
							render={({ onClick }) => (
								<SignSocialButton type="button" onClick={onClick}>
									<SignIcon src={Google} alt="google auth" />
									Sign up with Google
								</SignSocialButton>
							)}
							onSuccess={handleGoogle}
							onFailure={e => console.log(e)}
							cookiePolicy="single_host_origin"
						/>
						{/* <FacebookLogin
							appId="2529818080622281" // facebook app id
							fields="email,first_name,last_name,name"
							version="6.0"
							render={({ onClick }) => (
								<SignSocialButton type="button" onClick={onClick}>
									<SignIcon src={Facebook} alt="facebook auth" />
									Sign up with Facebook
								</SignSocialButton>
							)}
							onReject={e => console.log(e)}
							callback={handleFacebook}
						/> */}
						{/* <div className="buttonWrap">
							<InstagramLogin
								clientId="5fd2f11482844c5eba963747a5f34556"
								buttonText="Login"
								onSuccess={res => console.log(res)}
								onFailure={err => console.log(err)}
								cssClass="ant-btn socialSubmit ant-btn-button"
							>
								Sign up with Instagram
							</InstagramLogin>
						</div> */}
						<Typography className="or">Or</Typography>
						<Link to="/signin" className="ant-btn other ant-btn-submit">
							Have an account? Sign in
						</Link>
					</form>
				</Paper>
			</Grid>
			<Footer />
		</main>
	)
}

export default withStyles(styles)(SignUp)
