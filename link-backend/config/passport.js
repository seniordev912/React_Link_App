const { lookup } = require('geoip-lite')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const FacebookTokenStrategy = require('passport-facebook-token')
const GoogleTokenStrategy = require('passport-google-token').Strategy
const InstagramTokenStrategy = require('passport-instagram-token')
const config = require('./index')
const User = require('../models/user')
const Code = require('../models/code')
const GeoInfo = require('../models/geoInfo')
const { getGeoInfo, getClientIp } = require('../utils')

// JSON WEB TOKENS STRATEGY
module.exports = passport => {
	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: config.JWT_SECRET,
				passReqToCallback: true
			},
			async (req, payload, done) => {
				try {
					const user = await User.findById(payload.sub)
					if (!user) {
						return done(null, false)
					}
					req.user = user
					done(null, user)
				} catch (error) {
					done(error, false)
				}
			}
		)
	)

	passport.use(
		'googleToken',
		new GoogleTokenStrategy(
			{
				clientID: config.GOOGLE_CLIENT_ID,
				clientSecret: config.GOOGLE_CLIENT_SECRET,
				passReqToCallback: true
			},
			async (req, _accessToken, _refreshToken, profile, done) => {
				try {
					if (req.user) {
						req.user.methods.push('google')
						req.user.google = {
							id: profile.id,
							email: profile.emails[0].value
						}
						await req.user.save()
						return done(null, req.user)
					}
					let existingUser = await User.findOne({ 'google.id': profile.id })
					if (existingUser) {
						const ip = getClientIp(req)
						if (ip) {
							const existsGeo = await GeoInfo.exists({
								ip,
								user: existingUser.id
							})
							if (!existsGeo) {
								const geo = getGeoInfo(req)
								if (geo) {
									await GeoInfo.create({
										...geo,
										user: existingUser
									})
								}
							}
						}
						return done(null, existingUser)
					}
					existingUser = await User.findOne({
						'local.email': profile.emails[0].value
					})
					if (existingUser) {
						existingUser.methods.push('google')
						existingUser.google = {
							id: profile.id,
							email: profile.emails[0].value
						}
						await existingUser.save()
						return done(null, existingUser)
					}
					const newUser = new User({
						username: profile.displayName.split(' ').join('_'),
						email: profile.emails[0].value,
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
						methods: ['google'],
						google: {
							id: profile.id,
							email: profile.emails[0].value
						}
					})
					const geo = getGeoInfo(req)
					if (geo) {
						await GeoInfo.create({
							...geo,
							user: newUser
						})
					}
					const code = await Code.create({ createdBy: newUser })
					await newUser.save()
					done(null, newUser)
					// newUser.code = code
					// done(null, newUser)
				} catch (error) {
					done(error, false, error.message)
				}
			}
		)
	)

	passport.use(
		'facebookToken',
		new FacebookTokenStrategy(
			{
				clientID: config.FACEBOOK_CLIENT_ID,
				clientSecret: config.FACEBOOK_CLIENT_SECRET,
				passReqToCallback: true
			},
			async (req, _accessToken, _refreshToken, profile, done) => {
				try {
					if (req.user) {
						req.user.methods.push('facebook')
						req.user.facebook = {
							id: profile.id,
							email: profile.emails[0].value
						}
						await req.user.save()
						return done(null, req.user)
					}
					let existingUser = await User.findOne({ 'facebook.id': profile.id })
					if (existingUser) {
						const ip = getClientIp(req)
						if (ip) {
							const existsGeo = await GeoInfo.exists({
								ip,
								user: existingUser.id
							})
							if (!existsGeo) {
								const geo = getGeoInfo(req)
								if (geo) {
									await GeoInfo.create({
										...geo,
										user: existingUser
									})
								}
							}
						}
						return done(null, existingUser)
					}
					existingUser = await User.findOne({
						'local.email': profile.emails[0].value
					})
					if (existingUser) {
						existingUser.methods.push('facebook')
						existingUser.facebook = {
							id: profile.id,
							email: profile.emails[0].value
						}
						await existingUser.save()
						return done(null, existingUser)
					}
					const newUser = await User.create({
						username: profile.displayName.split(' ').join('_'),
						email: profile.emails[0].value,
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
						methods: ['facebook'],
						facebook: {
							id: profile.id,
							email: profile.emails[0].value
						}
					})
					const geo = getGeoInfo(req)
					if (geo) {
						await GeoInfo.create({
							...geo,
							user: newUser
						})
					}
					const code = await Code.create({ createdBy: newUser })
					await newUser.save()
					done(null, newUser)

					// newUser.code = code
					// done(null, newUser)
					// const user = newUser.toJSON()
					// return done(null, {
					// 	...user,
					// 	code
					// })
				} catch (error) {
					done(error, false, error.message)
				}
			}
		)
	)

	passport.use(
		'instagramToken',
		new InstagramTokenStrategy(
			{
				clientID: config.INSTAGRAM_CLIENT_ID,
				clientSecret: config.INSTAGRAM_CLIENT_SECRET,
				passReqToCallback: true
			},
			async (req, _accessToken, _refreshToken, profile, done) => {
				try {
					if (req.user) {
						req.user.methods.push('instagram')
						req.user.instagram = {
							id: profile.id,
							email: profile.emails[0].value
						}
						await req.user.save()
						return done(null, req.user)
					}
					let existingUser = await User.findOne({ 'instagram.id': profile.id })
					if (existingUser) {
						const ip = getClientIp(req)
						if (ip) {
							const existsGeo = await GeoInfo.exists({
								ip,
								user: existingUser.id
							})
							if (!existsGeo) {
								const geo = getGeoInfo(req)
								if (geo) {
									await GeoInfo.create({
										...geo,
										user: existingUser
									})
								}
							}
						}
						return done(null, existingUser)
					}
					existingUser = await User.findOne({
						'local.email': profile.emails[0].value
					})
					if (existingUser) {
						existingUser.methods.push('instagram')
						existingUser.instagram = {
							id: profile.id,
							email: profile.emails[0].value
						}
						await existingUser.save()
						return done(null, existingUser)
					}
					const splited = profile.displayName.split(' ')
					const newUser = await User.create({
						username: profile.username,
						email: profile.emails[0].value,
						firstName: splited[0],
						lastName:
							splited[0] === splited[splited.length - 1]
								? ''
								: splited[splited.length - 1],
						methods: ['instagram'],
						instagram: {
							id: profile.id,
							email: profile.emails[0].value
						}
					})
					const geo = getGeoInfo(req)
					if (geo) {
						await GeoInfo.create({
							...geo,
							user: newUser
						})
					}
					const code = await Code.create({ createdBy: newUser })
					await newUser.save()
					done(null, newUser)
					// done(null, { ...newUser, code })
					// done(null, {
					// 	...newUser._doc,
					// 	code
					// })
				} catch (error) {
					done(error, false, error.message)
				}
			}
		)
	)

	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passReqToCallback: true
			},
			async (req, email, password, done) => {
				try {
					const user = await User.findOne({ 'local.email': email })
					if (!user) {
						return done(new Error('This user doesn\'t exist'), false)
					}
					const isMatch = await user.isValidPassword(password)
					if (!isMatch) {
						return done(new Error('Your password is incorrect'), false)
					}
					const ip = getClientIp(req)
					if (ip) {
						const existsGeo = await GeoInfo.exists({ ip, user: user.id })
						if (!existsGeo) {
							const geo = getGeoInfo(req)
							if (geo) {
								await GeoInfo.create({
									...geo,
									user: user
								})
							}
						}
					}
					done(null, user)
				} catch (error) {
					done(error, false)
				}
			}
		)
	)
}
