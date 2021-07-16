import app from './app';
import * as CONFIG from './config';

export const main = () => {
  app.listen(CONFIG.port, () => {
    console.log(`Server listening at http://localhost:${CONFIG.port}`);
  });
};
main();
