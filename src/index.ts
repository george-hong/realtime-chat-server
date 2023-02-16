import express from 'express';
import expressWs from 'express-ws';
import bodyParser from 'body-parser';
import Base from './middleware/base';
import apiRouter from './api';
import getSocketMiddleWare from './socket';

const app = express();
const wsApp = expressWs(app);
const port = 4000;

app.use([
  Base.setRequest,
  Base.allowCrossOrigin,
  Base.parseUserFromToken,

  bodyParser.json(),
]);

app.use('/api', apiRouter);

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
});

// @ts-ignore
app.ws('/chat', getSocketMiddleWare(wsApp));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
