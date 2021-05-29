import React from 'react'
import Navigation from '../Navigation'
import FooterApp from '../FooterApp'

import './index.scss'

const MainLayout = props => {
	const { children } = props;
	return (
		<div>
			<Navigation/>
			<div>
				{children}
			</div>
			<FooterApp/>
		</div>
	)
}

export default MainLayout
