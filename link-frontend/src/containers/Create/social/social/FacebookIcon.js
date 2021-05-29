import React from 'react'

const FacebookIcon = ({ color }) => {
	return (
		<svg
			width="1em"
			height="1em"
			viewBox="0 0 16 15"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g
					id="Design"
					transform="translate(-564.000000, -852.000000)"
					fill={color || '#E2E2E2'}
					style={{ transition: 'all 0.4s linear' }}
				>
					<g id="Group-6" transform="translate(311.000000, 244.000000)">
						<g id="Group-2" transform="translate(68.000000, 608.000000)">
							<path
								d="M200.616499,7.54563895 C200.616499,3.37728195 197.259645,0 193.116499,0 C188.973354,0 185.616499,3.37728195 185.616499,7.54563895 C185.616499,11.3117647 188.359141,14.4334686 191.944624,15 L191.944624,9.72687627 L190.039383,9.72687627 L190.039383,7.54563895 L191.944624,7.54563895 L191.944624,5.8831643 C191.944624,3.99219067 193.063576,2.94766734 194.777387,2.94766734 C195.598153,2.94766734 196.456419,3.09492901 196.456419,3.09492901 L196.456419,4.95091278 L195.510451,4.95091278 C194.578999,4.95091278 194.288374,5.5326572 194.288374,6.12931034 L194.288374,7.54563895 L196.368415,7.54563895 L196.035753,9.72687627 L194.288374,9.72687627 L194.288374,15 C197.873858,14.4334686 200.616499,11.3117647 200.616499,7.54563895 Z"
								id="Path"
							/>
						</g>
					</g>
				</g>
			</g>
		</svg>
	)
}

export default FacebookIcon