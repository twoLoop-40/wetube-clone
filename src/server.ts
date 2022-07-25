import express from 'express';
import { rootRouter } from './routers/rootRouter';
import { userRouter } from './routers/userRouter';
import { videoRouter } from './routers/videoRouter';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';
import { localsMiddleware } from './middlewares';

const app = express();
const logger = morgan('dev');

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'my secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(localsMiddleware);
app.use('/uploads', express.static('uploads'));
app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/stories', videoRouter);

export default app;
