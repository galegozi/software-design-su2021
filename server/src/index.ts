import express from 'express';
import cors from 'cors';
import DBClient from './database/client';
import bcrypt from 'bcrypt';
import { json as bodyParserJson } from 'body-parser';

const { prisma } = DBClient.getInstance();

const app = express();
const port = 3001;
const saltRounds = 10; // salt rounds for password hashing

app.use(bodyParserJson());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

app.get('/users', (req, res) => {
  // connect to the database
  // run the command to select the users
  // format the data in the way we want to return it
  // send it back with res.json
  res.json({ message: 'Hello from auth' });
});

app.post('/user', async (req, res) => {
  // get the user out of the request
  let { username, password } = req.body;
  // hash the password
  const hashed = await bcrypt.hash(password, saltRounds);
  // now that we've hashed the password, remove the memory of the plaintext password
  password = null;
  delete req.body.password;
  // create the user in the database
  try {
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

app.listen(port, () => {
  console.log(`Example server listening at http://localhost:${port}`);
});
