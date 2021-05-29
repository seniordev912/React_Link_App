/**
 * This function is to return the seconds of time spend before click in some item
 * @param before This is the entered time
 * @param after This is time he clicked
 */
module.exports = (before, after) => {
	return Number(
		((new Date(after).getTime() - new Date(before).getTime()) / 1000).toFixed(2)
	)
}
