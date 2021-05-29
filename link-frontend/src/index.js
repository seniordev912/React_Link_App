import React from 'react'
import ReactDOM from 'react-dom'
import { StoreContext } from 'storeon/react'
import { ParallaxProvider } from 'react-scroll-parallax'
import App from './containers/App'
import store from './store'

ReactDOM.render(
	<ParallaxProvider>
		<StoreContext.Provider value={store}>
			<App />
		</StoreContext.Provider>
	</ParallaxProvider>,
	document.getElementById('root')
)
