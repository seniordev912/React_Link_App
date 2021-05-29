const url = require('url')

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const {
	AWS_SECRET_ACCESS,
	AWS_ACCESS_KEY,
	AWS_BUCKET,
	AWS_REGION
} = require('../config')

aws.config.update({
	secretAccessKey: AWS_SECRET_ACCESS,
	accessKeyId: AWS_ACCESS_KEY,
	region: AWS_REGION
})

const s3 = new aws.S3()

// error validation here
// add error validation for file size of 2mb or 2097152 bytes
const fileFilter = (req, file, cb) => {
	// console.log('============>>>>>', aws.config, file.mimetype, '============');
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true)
	} else {
		cb(
			new Error('Invalid image type. Only JPEG, JPG, and PNG are supported'),
			false
		)
	}
}

const upload = multer({
	fileFilter,
	storage: multerS3({
		s3,
		bucket: 'link124',
		acl: 'public-read',
		contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata(req, file, cb) {
			cb(null, {fieldName: 'test_m'})
		},
		key(req, file, cb) {
			cb(null, `${Date.now().toString()}-${file.originalname}`)
		}
	})
})

const deleteS3File = imageUrl => {
	if (typeof imageUrl === 'string') {
		const Key = url.parse(imageUrl).pathname.substr(1)
		return s3.deleteObject({ Key, Bucket: AWS_BUCKET }).promise()
	}
	const keyList = imageUrl.map(s3Url => ({
		Key: url.parse(s3Url).pathname.substr(1)
	}))
	return s3
		.deleteObjects({
			Bucket: AWS_BUCKET,
			Delete: {
				Objects: keyList,
				Quiet: false
			}
		})
		.promise()
}

module.exports = {
	upload,
	deleteS3File
}
