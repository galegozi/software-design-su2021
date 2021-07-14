import express from 'express';
import cors from 'cors';
import DBClient from './database/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { json as bodyParserJson } from 'body-parser';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import type { StrategyOptions } from 'passport-jwt';
import passport from 'passport';

if (!process.env.JWT_SECRET) {
  console.error(
    "Please create JWT_SECRET environment variable with crypto.randomBytes(64).toString('hex');"
  );
}

const { prisma } = DBClient.getInstance();

const app = express();
const port = 3001;
const saltRounds = 10; // salt rounds for password hashing

const JWTOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: 'softwaredesignsu2021.local',
  audience: 'softwaredesignsu2021.local',
};

const createSignedJWTForUser = (user: { id: number; username: string }) => {
  const token = jwt.sign(
    { sub: user, iss: JWTOptions.issuer, aud: JWTOptions.audience },
    JWTOptions.secretOrKey!,
    { expiresIn: 10000000 }
  );
  return token;
};

passport.use(
  new JWTStrategy(JWTOptions, async (jwt_payload, done) => {
    try {
      const user = await prisma.usercredentials.findUnique({
        where: { id: jwt_payload.sub },
      });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (e) {
      return done(e, false);
    }
  })
);

app.use(bodyParserJson());
app.use(cors());

app.post('/login', async (req, res) => {
  // get the username and password from the req body
  let { username, password } = req.body;
  if (!username) {
    return res
      .status(400)
      .json({ error: true, message: 'You must provide a username.' });
  } else if (!password) {
    return res
      .status(400)
      .json({ error: true, message: 'You must provide a username.' });
  }
  try {
    // get the user from the database
    const user = await prisma.usercredentials.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(400).json({ error: true, message: 'User not found' });
    }
    // compare the password
    const authenticated = await bcrypt.compare(password, user.password);
    // now that we've hashed the password, remove the memory of the plaintext password
    password = null;
    delete req.body.password;
    // reject incorrect password attempts
    if (!authenticated) {
      return res
        .status(401)
        .json({ error: true, message: 'Incorrect password' });
    }
    // get the JWT
    const userJWT = createSignedJWTForUser({
      username: user.username,
      id: user.id,
    });
    return res.status(200).json(userJWT);
  } catch (e) {
    // log the error to the server console
    console.error(e);
    return res
      .status(400)
      .json({ error: true, message: 'Unknown error occurred' });
  }
});

app.get('/users', async (req, res) => {
  // connect to the database
  // run the command to select the users
  // format the data in the way we want to return it
  // send it back with res.json
  // res.json({ message: 'Hello from auth' });
  const users = await prisma.usercredentials.findMany({
    select: { id: true, username: true },
  });
  res.status(200).json(users);
});

app.post('/register', async (req, res) => {
  // get the user out of the request
  let { username, password } = req.body;

  try {
    // hash the password
    const hashed = await bcrypt.hash(password, saltRounds);
    // now that we've hashed the password, remove the memory of the plaintext password
    password = null;
    delete req.body.password;
    // create the user in the database
    await prisma.usercredentials.create({
      data: { username, password: hashed },
    });
    // TODO: create the JWT and set the header/cookie
    res.status(201).json({ error: false, message: 'User created' });
  } catch (e) {
    // https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
    // Errorcode P2002 is unique constraint, which is the only "known" error we should have when creating an account
    if (e.code === 'P2002') {
      res
        .status(400)
        .json({ error: true, message: 'That user already exists.' });
    } else {
      // log the error to the server console
      console.error(e);
      res.status(400).json({ error: true, message: 'Unknown Error occurred' });
    }
  }
});

app.post('/userInfo', async (req, res) => {
  // get the user updated profile out of the request
  const { name, addr1, addr2, city, state, zipCode } = req.body;
  //validation
  //name must have less than 100 characters
  if (name.length > 100) {
    return res.status(400).json({ error: true, message: 'Name is too long' });
  }
  //addr1 must have at least 5 characters
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

app.get('/userInfo', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Example server listening at http://localhost:${port}`);
});
