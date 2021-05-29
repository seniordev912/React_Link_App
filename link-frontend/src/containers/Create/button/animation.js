const takeAnimation = animation => {
	switch (animation) {
		case 'shake':
			return 'animated infinite shake'
		case 'bounce':
			return 'animated infinite bounce'
		case 'fade-up':
			return 'animated fadeInUp'
		case 'fade-down':
			return 'animated fadeInDown'
		case 'flip':
			return 'animated flipInX'
		case 'jello':
			return 'animated jello'
		case 'pulse':
			return 'animated pulse'
		case 'flash':
			return 'animated flash'
		case 'swing':
			return 'animated swing'
		case 'tada':
			return 'animated tada'
		default:
			return ''
	}
}

export default takeAnimation
