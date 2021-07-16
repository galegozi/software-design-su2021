import express from 'express';
import cors from 'cors';
import { json as bodyParserJson } from 'body-parser';
import passport from 'passport';
import * as CONFIG from './config';
// routers
import usersRouter from './users';
import { passportJWTStrategy } from './utils/auth';

// instantiate express app
const app = express();

// add middleware
app.use(bodyParserJson());
app.use(cors());
app.use(passport.initialize());

// Add strategy to passport
passportJWTStrategy(passport);

// add the subrouters
app.use(usersRouter);

export const main = (port?: number) => {
  app.listen(port || CONFIG.port, () => {
    console.log(`Server listening at http://localhost:${port || CONFIG.port}`);
  });
};

// export the app so it can be used for testing
export default app;
