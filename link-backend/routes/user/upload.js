const UploadController = require('../../controllers/user/upload')
const {
	authenticated,
	isIdValid,
	isFromAuthUser
} = require('../../helpers/routeHelpers')

module.exports = router => {
	// multiple image upload
	router
		.route('/cards/:cardId/image-upload')
		.post(
			isIdValid('cardId'),
			authenticated,
			isFromAuthUser(),
			UploadController.uploadCardImage
		)
		.delete(
			isIdValid('cardId'),
			authenticated,
			isFromAuthUser(),
			UploadController.deleteCardImage
		)

	// single image upload
	router
		.route('/cards/:cardId/buttons/:buttonId/image-upload')
		.post(
			isIdValid('cardId'),
			isIdValid('buttonId'),
			authenticated,
			isFromAuthUser(),
			UploadController.uploadButtonImage
		)
		.patch(
			isIdValid('cardId'),
			isIdValid('buttonId'),
			authenticated,
			isFromAuthUser(),
			UploadController.updateButtonImage
		)
		.delete(
			isIdValid('cardId'),
			isIdValid('buttonId'),
			authenticated,
			isFromAuthUser(),
			UploadController.deleteButtonImage
		)
	
	router
		.route('/product/uploadProductImage')
		.post(
			UploadController.uploadProductImage
		)
}
