const Card = require('../../models/card')
const Button = require('../../models/button')
const { upload, deleteS3File } = require('../../services/upload')

module.exports = {
	uploadCardImage: async (req, res) => {
		upload.single('image')(req, res, async err => {
			if (err) {
				return res.sendStatus(400).json({ message: err.message })
			}
			const imageUrl = req.file.location
			await Card.updateOne(
				{ _id: req.params.cardId },
				{ $push: { imageUrl } }
			)
			return res.json({ imageUrl })
		})
	},

	deleteCardImage: async (req, res) => {
		// code here to delete one card image (delete one at a time only)
		const selImage = req.body.fileName
		const cardObj = await Card.findById(req.params.cardId)
		if (cardObj) {
			if (cardObj.imageUrl && cardObj.imageUrl.length > 0) {
				const cObj = []
				const urls = cardObj.imageUrl
				for(let i = 0; i < urls.length; i++) {
					if(urls[i] !== selImage) {
						cObj.push(urls[i])
					}
				}
				await deleteS3File(selImage)
				await Card.findOneAndUpdate(
					{_id : cardObj._id},
					{imageUrl: cObj}
				)
			}
			return res.status(201).end()
		}
		return res.status(404).json({ message: 'Card not found' })
	},

	uploadButtonImage: async (req, res) => {
		// code here to upload (post) single card image
		upload.single('image')(req, res, async err => {
			if (err) {
				// move all error validation to ./services/upload
				return res.sendStatus(400).json({ message: err.message })
			}
			const imageUrl = req.file.location
			await Button.updateOne({ _id: req.params.buttonId }, { imageUrl })
			return res.json({ imageUrl })
		})
	},

	uploadProductImage: async (req, res) => {
		upload.single('image')(req, res, async err => {
			if(err) {
				console.log(err)
				return res.sendStatus(400).json({ message: err.message })
			}
			const imageUrl = req.file.location
			return res.json({ success: true, imageUrl })
		})
	},

	updateButtonImage: async (req, res) => {
		//  code  here to update single Button image from DB
		const buttonObj = await Button.findById(req.params.buttonId)
		if (buttonObj) {
			if (buttonObj.imageUrl) {
				await deleteS3File(buttonObj.imageUrl)
			}
			upload.single('image')(req, res, async err => {
				if (err) {
					// move all error validation to ./services/upload
					return res.sendStatus(400).json({ message: err.message })
				}
				const imageUrl = req.file.location
				buttonObj.imageUrl = imageUrl
				await buttonObj.save()
				return res.json({ imageUrl })
			})
		} else {
			return res.status(404).json({ message: 'Button not found' })
		}
	},

	deleteButtonImage: async (req, res) => {
		const buttonObj = await Button.findById(req.params.buttonId)
		if (buttonObj) {
			if (buttonObj.imageUrl) {
				await deleteS3File(buttonObj.imageUrl)
				buttonObj.imageUrl = null
				await buttonObj.save()
			}
			return res.status(201).end()
		}
		return res.status(404).json({ message: 'Button not found' })
	}
}
