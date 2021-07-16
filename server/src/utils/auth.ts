import DBClient from '../database/client';
import { Strategy as JWTStrategy } from 'passport-jwt';
import * as CONFIG from '../config';
import  type { PassportStatic } from 'passport'
const { prisma } = DBClient.getInstance();

// takes the passport instance and adds the strategy
export const passportJWTStrategy = (passport:PassportStatic) => {
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
};
