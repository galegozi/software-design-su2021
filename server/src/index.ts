import app from './app';
import * as CONFIG from './config';

app.listen(CONFIG.port, () => {
  console.log(`Server listening at http://localhost:${CONFIG.port}`);
});
