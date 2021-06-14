import express from 'express';
import cors from 'cors';
const app = express();
const port = 3001;
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

app.listen(port, () => {
  console.log(`Example server listening at http://localhost:${port}`);
});
