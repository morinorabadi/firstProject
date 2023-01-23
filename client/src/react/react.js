// styles
import './style.sass'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'

export default function render() {
    ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
}
