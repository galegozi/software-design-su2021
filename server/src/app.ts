import express from 'express'
import cors from 'cors'
import { json as bodyParserJson } from 'body-parser'
import passport from 'passport'
import * as CONFIG from './config'
// routers
import usersRouter from './users'
import { passportJWTStrategy } from './utils/auth'

// instantiate express app
const app = express()

// add middleware
app.use(bodyParserJson())
app.use(cors())
app.use(passport.initialize())

// Add strategy to passport
passportJWTStrategy(passport)

// add the subrouters
app.use(usersRouter)

let myport = 0
export const fxn = () => {
  console.log('listening on port: ' + myport)
}

export const main = (port?: number) => {
  myport = port || CONFIG.port
  const server = app.listen(myport, fxn)
  return server
}

// export the app so it can be used for testing
export default app
