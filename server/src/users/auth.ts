import DBClient from '../database/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Router } from 'express'
if (!process.env.JWT_SECRET) {
  console.error(
    "Please create JWT_SECRET environment variable with crypto.randomBytes(64).toString('hex');"
  )
  // console.log(process.exit);
  process.exit(1)
}

import * as CONFIG from '../config'

const router = Router()
const prisma = DBClient.getInstance().prisma

export const createSignedJWTForUser = (user: {
  id: number
  username: string
}) => {
  const token = jwt.sign(
    {
      sub: user,
      iss: CONFIG.JWTOptions.issuer,
      aud: CONFIG.JWTOptions.audience,
    },
    CONFIG.JWTOptions.secretOrKey!,
    { expiresIn: CONFIG.JWT_EXPIRATION_TIME }
  )
  return token
}

router.post('/login', async (req, res) => {
  // get the username and password from the req body
  let { username, password } = req.body
  if (!username) {
    return res
      .status(400)
      .json({ error: true, message: 'You must provide a username.' })
  } else if (!password) {
    return res
      .status(400)
      .json({ error: true, message: 'You must provide a username.' })
  }
  try {
    // get the user from the database
    const user = await prisma.usercredentials.findUnique({
      where: { username },
    })
    if (!user) {
      return res.status(401).json({ error: true, message: 'User not found' })
    }
    // compare the password
    const authenticated = await bcrypt.compare(password, user.password)
    // now that we've hashed the password, remove the memory of the plaintext password
    password = null
    delete req.body.password
    // reject incorrect password attempts
    if (!authenticated) {
      return res
        .status(401)
        .json({ error: true, message: 'Incorrect password' })
    }
    // get the JWT
    const userJWT = createSignedJWTForUser({
      username: user.username,
      id: user.id,
    })
    return res.status(200).json(userJWT)
  } catch (e) {
    // log the error to the server console
    console.error(e)
    return res
      .status(400)
      .json({ error: true, message: 'Unknown error occurred' })
  }
})

router.post('/register', async (req, res) => {
  // get the user out of the request
  let { username, password } = req.body

  try {
    // hash the password
    const hashed = await bcrypt.hash(password, CONFIG.saltRounds)
    // now that we've hashed the password, remove the memory of the plaintext password
    password = null
    delete req.body.password
    // create the user in the database
    await prisma.usercredentials.create({
      data: { username, password: hashed },
    })
    // TODO: create the JWT and set the header/cookie
    res.status(201).json({ error: false, message: 'User created' })
  } catch (e) {
    // https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
    // Errorcode P2002 is unique constraint, which is the only "known" error we should have when creating an account
    if (e.code === 'P2002') {
      res
        .status(400)
        .json({ error: true, message: 'That user already exists.' })
    } else {
      // log the error to the server console
      // console.error(e);
      res.status(400).json({ error: true, message: 'Unknown Error occurred' })
    }
  }
})

export default router
