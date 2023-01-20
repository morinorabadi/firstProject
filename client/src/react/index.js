// styles
import './style.sass'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './react/App'

function render() {
    ReactDOM.createRoot(document.getElementById('reactUI')).render(<App/>)
}

export {
    render
}