import express from 'express';
import cors from 'cors';
import * as CONFIG from './config';
import DBClient from './database/client';
import { json as bodyParserJson } from 'body-parser';
import passport from 'passport';
import { Strategy as JWTStrategy } from 'passport-jwt';
// routers
import usersRouter from './users';

// get instance of prismaa
const { prisma } = DBClient.getInstance();

// instantiate express app
const app = express();

// create Passport instance
passport.use(
  new JWTStrategy(CONFIG.JWTOptions, async (jwt_payload, done) => {
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

// add middleware
app.use(bodyParserJson());
app.use(cors());
app.use(passport.initialize());

// add the subrouters
app.use(usersRouter);

// add one test route
// app.get('/test', async (req, res) => {
//   return res.json({ message: 'pass' });
// });

// export the app so it can be used for testing
export default app;
