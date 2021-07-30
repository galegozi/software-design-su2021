import DBClient from '../database/client'
import { Router } from 'express'
import passport from 'passport'
const prisma = DBClient.getInstance().prisma

const router = Router()

router.post(
  '/userinfo',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id, username } = req.user as { username: string; id: number }
    // get the user updated profile out of the request
    const { name, addr1, addr2, city, state, zipCode } = req.body
    //validation
    //name must have less than 50 characters
    if (name.length > 50) {
      return res.status(400).json({ error: true, message: 'Name is too long' })
    }
    //addr1 must have at least 5 characters
    if (addr1.length < 5) {
      return res
        .status(400)
        .json({ error: true, message: 'Address 1 is too short' })
    }
    //addr1 must have at least 5 characters
    if (addr1.length > 100) {
      return res
        .status(400)
        .json({ error: true, message: 'Address 1 is too long' })
    }
    //addr1 must contain alphanumerical, '.', '-' and ' ' characters only
    if (/[^A-Za-z0-9'\.\-\s\,\#]/.test(addr1)) {
      return res
        .status(400)
        .json({ error: true, message: 'Address 1 has invalid character' })
    }
    //if addr2 is provided, it must contain alphanumerical, '.', '-' and ' ' characters only
    if (addr2?.length > 0) {
      if (/[^A-Za-z0-9'\.\-\s\,\ ]/.test(addr2)) {
        return res
          .status(400)
          .json({ error: true, message: 'Address 2 has invalid character' })
      }
      //addr2 length must be less than 100
      if (addr2?.length > 100) {
        return res
          .status(400)
          .json({ error: true, message: 'Address 2 is too long' })
      }
    }
    //city must have have 3-100 characters, alphabetical only
    if (city.length < 3) {
      return res.status(400).json({ error: true, message: 'City is too short' })
    }
    if (city.length > 100) {
      return res.status(400).json({ error: true, message: 'City is too long' })
    }
    if (/[^a-zA-Z]/.test(city)) {
      return res
        .status(400)
        .json({ error: true, message: 'City must contain letter only' })
    }
    //zipCode must have 5-9 characters, numerical only
    if (/[^0-9\s\-]/.test(zipCode)) {
      return res
        .status(400)
        .json({ error: true, message: 'Zip Code must contain digit only' })
    }
    if (zipCode.length < 5 || zipCode.length > 9) {
      return res
        .status(400)
        .json({ error: true, message: 'Zip Code must have 5 to 9 digits' })
    }

    // validate that every fields are correct
    //try
    try {
      await prisma.clientinformation.upsert({
        create: {
          usercredentials: { connect: { id } },
          name,
          address: addr1,
          address2: addr2,
          city,
          state,
          zip: zipCode,
        },
        update: {
          name,
          address: addr1,
          address2: addr2,
          city,
          state,
          zip: zipCode,
        },
        where: { user_id: id },
      })
      return res.status(200).json({ error: false, message: 'User Updated' })
    } catch (e) {
      console.error(e)
      return res
        .status(400)
        .json({ error: true, message: 'Unknown Error occurred' })
    }
  }
)

router.get(
  '/userinfo',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    //get user information to display on profile page load
    // assuming that the username is given by login part. It is hard coded for now

    const { username } = req.user as { username: string; id: number }
    // validate that every fields are correct
    //try
    try {
      const user = await prisma.usercredentials.findFirst({
        where: { username },
      })

      if (!user) {
        return res.status(400).json({ error: true, message: 'User not found' })
      }
      const id = user.id
      const userInfo = await prisma.clientinformation.findUnique({
        select: {
          name: true,
          address: true,
          address2: true,
          city: true,
          state: true,
          zip: true,
        },
        where: { user_id: id },
      })
      return res.status(200).json({
        name: userInfo?.name,
        city: userInfo?.city,
        state: userInfo?.state,
        zipCode: userInfo?.zip,
        addr1: userInfo?.address,
        addr2: userInfo?.address2,
      })
    } catch (e) {
      console.error(e)
      return res.status(400).json({
        error: true,
        message: 'Unknown Error occurred while trying to load user profile',
      })
    }
  }
)

export default router
