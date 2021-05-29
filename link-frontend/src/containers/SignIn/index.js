import React, { useState, useEffect } from 'react'
import { Typography, Grid, Paper } from '@material-ui/core'
import { useStoreon } from 'storeon/react'
import { Input } from 'antd'
import MetaTags from 'react-meta-tags'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from '../../constants/axios'
import Footer from '../../components/Footer'
import Facebook from '../../assets/icons/facebook.svg'
import Google from '../../assets/icons/google.svg'
import linkupIcon from '../../components/Navigation/images/linkup_icon.png'
import './index.css'
import SignIcon from '../../components/Sign/SignIcon'
import { SignSocialButton, SignButton } from '../../components/Sign/SignButton'
import SocialMetaImg from '../../assets/images/meta-social.png'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})

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

function SignIn(props, user) {
	const { classes } = props
	const { dispatch } = useStoreon('session')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [googleLoading, setGoogleLoading] = useState(false)
	const [fbLoading, setFbLoading] = useState(false)
	const signIn = async () => {
		setLoading(true)
		if (email === '' || password === '') {
			setLoading(false)
			setError('Input all required fields correctly')
			return
		}
		try {
			const { data } = await axios.post('user/auth/signin', {
				email,
				password
			})
			axios.defaults.headers.authorization = `Bearer ${data.token}`
			dispatch('session/set', data.user)
			setLoading(false)
			localStorage.setItem('token', data.token)
		} catch (err) {
			setLoading(false)
			if (err.response.data && err.response.data.error) {
				setError(err.response.data.error)
			} else {
				setError('Invalid email and password combination.')
			}
		}
	}
	const handleGoogle = async res => {
		setGoogleLoading(true)
		try {
			const { data } = await axios.post('user/auth/google', {
				access_token: res.accessToken
			})
			localStorage.setItem('token', data.token)
			axios.defaults.headers.authorization = `Bearer ${data.token}`
			dispatch('session/set', data.user)
			setGoogleLoading(false)
		} catch (err) {
			setGoogleLoading(false)
			if (err.response.data && err.response.data.error) {
				setError(err.response.data.error)
			}
		}
	}
	const handleFacebook = async res => {
		setFbLoading(true)
		try {
			const { data } = await axios.post('user/auth/facebook', {
				access_token: res.accessToken
			})
			localStorage.setItem('token', data.token)
			axios.defaults.headers.authorization = `Bearer ${data.token}`
			dispatch('session/set', data.user)
			setFbLoading(false)
		} catch (err) {
			setFbLoading(false)
			if (err.response.data && err.response.data.error) {
				setError(err.response.data.error)
			}
		}
	}
	const handleTwitter = async (err, res) => {
		const { data } = await axios.post('user/auth/twitter', res)
		localStorage.setItem('token', data.token)
		axios.defaults.headers.authorization = `Bearer ${data.token}`
		dispatch('session/set', data.user)
	}

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
			"!function(d,s,c){s=d.createElement('script');s.src='https://widget.indemand.ly/launcher.js';s.onload=function(){indemandly=new Indemandly({domain:'david-phan'})};c=d.getElementsByTagName('script')[0];c.parentNode.insertBefore(s,c)}(document)"
		document.head.appendChild(newScript)

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
					<Typography component="h1" variant="h5">
						Sign In
					</Typography>
					<form
						layout="vertical"
						name="Signin"
						initialvalues={{ remember: true }}
						className={classes.form}
						onSubmit={e => {
							e.preventDefault()
							signIn()
						}}
					>
						<Typography component="p" variant="subtitle1" style={{ marginBottom: '10px' }}>
							Email
						</Typography>
						<Input
							style={{ marginBottom: '18px' }}
							placeholder="Email"
							name="email"
							id="email"
							type="email"
							autoComplete="on"
							required
							autoFocus
							className="formInput"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>

						<Typography component="p" variant="subtitle1" style={{ marginBottom: '10px' }}>
							Password
						</Typography>
						<Input.Password
							style={{ marginBottom: '16px' }}
							placeholder="Password"
							name="password"
							type="password"
							id="password"
							autoComplete="on"
							className="formInput"
							required
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>

						<Link className="textButton" to="/forgot-password">
							Forgot Password?
						</Link>

						{error && (
							<div className="errorText">
								{typeof error === 'object' && typeof error.length !== 'undefined'
									? error.map(message => <p key={message}>{message}</p>)
									: error}
							</div>
						)}
						{/* {error && <div className="errorText">{error}</div>} */}

						<div className="buttonWrap">
							<SignButton loading={loading} htmlType="submit">
								Sign in
							</SignButton>
							{/* <button type="submit" className="ant-btn submit ant-btn-submit">
								Sign in
							</button> */}
						</div>

						<GoogleLogin
							clientId="625799337149-lsii2ae1u7bjvr3psohm5k4533vrf3vf.apps.googleusercontent.com" // google client id
							// clientId="1014050097178-jgrecianr45gh1de7i8pqdr8pof9kdke.apps.googleusercontent.com" // google client id
							render={({ onClick }) => (
								<SignSocialButton type="button" onClick={onClick}>
									<SignIcon src={Google} alt="google auth" />
									Sign in with Google
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
									Sign in with Facebook
								</SignSocialButton>
							)}
							onReject={e => console.log(e)}
							callback={handleFacebook}
						/> */}
						<Typography className="or">Or</Typography>
						<Link to="/signup" className="ant-btn other ant-btn-submit">
							Don't have an account? Sign up
						</Link>
					</form>
				</Paper>
			</Grid>
			<Footer />
		</main>
	)
}

export default withStyles(styles)(SignIn)
