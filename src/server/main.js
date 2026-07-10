import debug from 'debug'
import params from '../../params'
import * as server from './server'

server.createServer(params.server).then(() => {
  console.log('Ready ! ')
})
