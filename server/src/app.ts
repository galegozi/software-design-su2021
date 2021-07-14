import express from 'express';
import cors from 'cors';

import { json as bodyParserJson } from 'body-parser';

// routers
import usersRouter from './users';

// instantiate express app
const app = express();

// add middleware
app.use(bodyParserJson());
app.use(cors());

// add the subrouters
app.use(usersRouter);
// export the app so it can be used for testing

export default app;
