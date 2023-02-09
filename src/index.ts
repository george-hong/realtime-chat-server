import express from 'express';
import Base from './middleware/base';
import apiRouter from './api';

const app = express();
const port = 3000;

app.use([
  Base.responseOptionsSpeedy,
  Base.setRequest,
  Base.allowCrossOrigin,
  Base.parseUserFromToken,
]);

app.use('/api', apiRouter);

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
