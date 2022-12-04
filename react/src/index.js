// styles
import './style.sass'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './react/App'

function render() {
    // render react
    ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
}

export {
    render
}