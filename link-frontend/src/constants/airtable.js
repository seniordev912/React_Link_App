import Airtable from 'airtable'

const airtable = new Airtable({ apiKey: 'keyAYuXNZumm4ZvPD' })

const base = airtable.base('appOlJNn8xmSVDDQa')

const newsBase = airtable.base('appJH7irJ36Ka4fdo')

export const createFeedback = ({ message, emoji, username, email }) =>
	base('feedback').create({
		message,
		emoji,
		username,
		email
	})

export const signToNewsletter = Email => {
	return newsBase('newsletter sign up - footer').create({
		Email
	})
}
