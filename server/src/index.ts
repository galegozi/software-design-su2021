import express from 'express';
import cors from 'cors';
const app = express();
const port = 3001;
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

app.listen(port, () => {
  console.log(`Example server listening at http://localhost:${port}`);
});
