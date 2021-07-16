import DBClient from '../database/client';
import { Router } from 'express';
const prisma = DBClient.getInstance().prisma;

const router = Router();

router.post('/userinfo', async (req, res) => {
  // get the user updated profile out of the request
  const { name, addr1, addr2, city, state, zipCode } = req.body;
  //validation
  //name must have less than 100 characters
  if (name.length > 100) {
    return res.status(400).json({ error: true, message: 'Name is too long' });
  }
  //addr1 must have at least 5 characters
  console.log('length is ' + addr1.length);
  if (addr1.length < 5) {
    return res
      .status(400)
      .json({ error: true, message: 'Address 1 is too short' });
  }
  //addr1 must contain alphanumerical, '.', '-' and ' ' characters only
  if (/[^A-Za-z0-9'\.\-\s\,\#]/.test(addr1)) {
    return res
      .status(400)
      .json({ error: true, message: 'Address 1 has invalid character' });
  }
  //if addr2 is provided, it must contain alphanumerical, '.', '-' and ' ' characters only
  if (addr2.length > 0) {
    if (/[^A-Za-z0-9'\.\-\s\,\ ]/.test(addr2)) {
      return res
        .status(400)
        .json({ error: true, message: 'Address 2 has invalid character' });
    }
  }
  //city must have at least 3 characters, alphabetical only
  if (city.length < 3) {
    return res.status(400).json({ error: true, message: 'City is too short' });
  }
  if (/[^a-zA-Z]/.test(city)) {
    return res
      .status(400)
      .json({ error: true, message: 'City must contain letter only' });
  }
  //zipCode must have 5 characters, numerical only
  if (/[^0-9]/.test(zipCode)) {
    return res
      .status(400)
      .json({ error: true, message: 'Zip Code must contain digit only' });
  }
  if (zipCode.length != 5) {
    return res
      .status(400)
      .json({ error: true, message: 'Zip Code must have 5 digits' });
  }
  // assuming that the username is given by login part. It is hard coded for now
  const username = 'quannguyen';
  // validate that every fields are correct
  //try
  try {
    const user = await prisma.usercredentials.findFirst({
      where: { username },
    });
    if (!user) {
      return res.status(400).json({ error: true, message: 'User not found' });
    }
    const id = user.id;
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
    });
    return res.status(200).json({ error: false, message: 'User Updated' });
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ error: true, message: 'Unknown Error occurred' });
  }
  // send update to database
  // response with success or error
});

router.get('/userinfo', async (req, res) => {
  //get user information to display on profile page load
  // assuming that the username is given by login part. It is hard coded for now
  const username = 'quannguyen';
  // validate that every fields are correct
  //try
  try {
    const user = await prisma.usercredentials.findFirst({
      where: { username },
    });
    if (!user) {
      return res.status(400).json({ error: true, message: 'User not found' });
    }
    const id = user.id;
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
    });
    return res.status(200).json(userInfo);
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      error: true,
      message: 'Unknown Error occurred while trying to load user profile',
    });
  }
  // send update to database
  // response with success or error
});

export default router;
