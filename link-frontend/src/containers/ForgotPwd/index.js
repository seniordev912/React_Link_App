import React, { useState } from 'react'
import { Typography, Grid, Paper } from '@material-ui/core'
import { Button, Input } from 'antd'
import withStyles from '@material-ui/core/styles/withStyles'
import { withRouter, Link } from 'react-router-dom'
import axios from '../../constants/axios'
import Footer from '../../components/Footer'
import linkupIcon from '../../components/Navigation/images/linkup_logo_icon.png'
import './index.css'
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

function ForgotPwd(props, user) {
	const { classes } = props

	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	// const [success, setSuccess] = useState('')

	const resetPwd = () => {
		if (email === '' || !email || email === undefined) {
			setError('Input all required fields correctly')
			setTimeout(() => {
				setError('')
			}, 5000)
			return
		} else {
			setLoading(true)
			axios
			.post('user/forgotPwd', {
				email
			})
			.then(response => {
				setLoading(false)
				console.log(response)
				if(response && response.data.result === 'success'){
					iziToast.success({
						message: "We sent a pin to your email. Check your inbox to receive it and enter it above."
					})
					setTimeout(() => {
						props.history.push('/reset-password')
					}, 3000)
					
				}
				if(response && response.data.result === 'failed'){
					iziToast.error({
						message: "We didn't send the email."
					})
				}
			})
			.catch(error => {
				setLoading(false)
				setError('User not found')
				iziToast.error({
					message: "We didn't send the email."
				})
				setTimeout(() => {
					setError('')
				}, 5000)
			})
		}
	}

	return (
		<main className={classes.main}>
			<Grid item container justify="center" alignItems="center" xs={12}>
				<Paper className={classes.paper}>
					<Link to="/">
						<img src={linkupIcon} className="linkup-icon" alt="linkup" />
					</Link>
					<Typography component="h1" variant="h5" className="">
						Forgot Password
					</Typography>

					<form
						name="Forgot Password"
						initialvalues={{ remember: true }}
						className={classes.form}
						onSubmit={e => e.preventDefault() && false}
					>
						<Typography component="p" variant="subtitle1" style={{ marginBottom: '10px' }}>
							Email
						</Typography>
						<Input
							id="email"
							name="email"
							autoComplete="on"
							placeholder="hello@youremail.com"
							autoFocus
							className="formInput"
							value={email}
							required
							onChange={e => setEmail(e.target.value)}
						/>

						{error && <div className="errorText">{error}</div>}

						<div className="buttonWrap">
							<Button type="submit" onClick={resetPwd} loading={loading} className="submit">
								Reset Password
							</Button>
						</div>
					</form>
				</Paper>
			</Grid>
			<Footer />
		</main>
	)
}

export default withRouter(withStyles(styles)(ForgotPwd))
