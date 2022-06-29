import express from 'express';
import { makeLogger } from './util';

const PORT = 4000;
const app = express();

const URLLogger = makeLogger(req => {
  console.log(`PATH: ${req?.path}`);
});
const timeLogger = makeLogger(() => {
  console.log(`TIME: ${new Date().toISOString()}`);
});
const securityLogger = makeLogger(req => {
  const protocol = req?.protocol;
  console.dir(req?.protocol);
  protocol && protocol === 'https'
    ? console.log('SECURE')
    : console.log('INSECURE');
});

const privateMiddleWare = makeLogger((req, res) => {
  if (req?.path === '/protected') {
    res?.send('You are not allowed');
  } else {
    console.log('Allowed, you may pass');
  }
});

const handleHome = (req: express.Request, res: express.Response) => {
  return res.send('<h1>You are home</h1>');
};

app.use(URLLogger, timeLogger, securityLogger, privateMiddleWare);
app.get('/', handleHome);

const listner = () => console.log(`Server is listening on port ${PORT}`);
app.listen(PORT, listner);
