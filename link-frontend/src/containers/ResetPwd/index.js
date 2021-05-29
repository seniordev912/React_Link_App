import React, { useState, useEffect } from 'react'
import { Typography, Grid, Paper } from '@material-ui/core'
import { Button, Input } from 'antd'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter, Link } from 'react-router-dom'
import axios from '../../constants/axios'
import MetaTags from 'react-meta-tags'
import Footer from '../../components/Footer'
import linkupIcon from '../../components/Navigation/images/linkup_logo_icon.png'
import './index.css'
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

function ResetPwd(props, user) {
	const { classes } = props

	const [pin, setPin] = useState('')
	const [newPwd, setNewPwd] = useState('')
	const [confirmPwd, setConfirmPwd] = useState('')
	const [error, setError] = useState('')

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

			<Grid container justify="center" alignItems="center" xs={12}>
				<Paper className={classes.paper}>
					<Link to="/">
						<img src={linkupIcon} className="linkup-icon" alt="linkup" />
					</Link>
					<Typography component="h1" variant="h5" className="">
						Reset Password
					</Typography>

					<form
						name="Reset Password"
						className={classes.form}
						onSubmit={e => e.preventDefault() && false}
					>
						<Typography component="p" variant="p" style={{ marginBottom: '10px' }}>
							PIN
						</Typography>
						<Input
							style={{ marginBottom: '18px' }}
							name="pin"
							id="pin"
							className="formInput"
							required
							value={pin}
							onChange={e => setPin(e.target.value)}
						/>

						<Typography component="p" variant="p" style={{ marginBottom: '10px' }}>
							New Password
						</Typography>
						<Input.Password
							style={{ marginBottom: '18px' }}
							name="password"
							type="password"
							id="password"
							autoComplete="on"
							className="formInput"
							required
							value={newPwd}
							onChange={e => setNewPwd(e.target.value)}
						/>

						<Typography component="p" variant="p" style={{ marginBottom: '10px' }}>
							Confirm New Password
						</Typography>
						<Input.Password
							style={{ marginBottom: '16px' }}
							name="password"
							type="password"
							id="password"
							className="formInput"
							required
							value={confirmPwd}
							onChange={e => setConfirmPwd(e.target.value)}
						/>

						{error && <div className="errorText">{error}</div>}
						<div className="buttonWrap">
							<Button type="submit" onClick={updatePwd} className="submit">
								Update Password
							</Button>
						</div>
					</form>
				</Paper>
			</Grid>
			<Footer />
		</main>
	)

	function updatePwd() {
		if (pin === '' || newPwd === '' || confirmPwd === '' || newPwd !== confirmPwd) {
			setError('Input all required fields correctly')
			setTimeout(() => {
				setError('')
			}, 5000)
			return
		}

		axios
			.post('user/resetPwd', {
				pin,
				password: newPwd
			})
			.then(response => {
				if(response && response.data.result) {
					iziToast.success({
						message: 'Your password has been updated!'
					})
					props.history.push('/signin')
				} else {
					iziToast.error({
						message: 'Your password has not been updated!'
					})
				}
				
			})
			.catch(error => {
				setError('Incorrect PIN')
				iziToast.error({
					message: 'Your password has not been updated!'
				})
				setTimeout(() => {
					setError('')
				}, 5000)
			})
	}
}

export default withRouter(withStyles(styles)(ResetPwd))
