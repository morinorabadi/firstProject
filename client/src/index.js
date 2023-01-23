// socket
import { socketInit } from './connection/Socket'
socketInit()


// redlib core
import { redLibInit } from './redlibCore/core'
redLibInit({ fps : 60 })

// react
import ReactRender from './react/react'
ReactRender()
