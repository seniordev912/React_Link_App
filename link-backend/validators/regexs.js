/**
 * This is to check if the font size is valid allow a max of 2 digits and 1 decimal and have to end with px
 */
exports.isFzValid = new RegExp(/^[0-9]{1,2}([.][0-9]{1})?px$/)

/**
 * This is to check if the color is a hex valid
 */
// exports.isColorValid = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/im)

/**
 * This is to check if the color is a rgba valid
 */
exports.isColorValid = new RegExp(
	'^rgba\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])%?\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])%?\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])%?\\s*,\\s*((0.[1-9][1-9]?)|[01])\\s*\\)$'
)
