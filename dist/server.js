import express from 'express';
import { rootRouter } from './routers/rootRouter';
import { userRouter } from './routers/userRouter';
import { videoRouter } from './routers/videoRouter';
import session from 'express-session';
import morgan from 'morgan';
const app = express();
const logger = morgan('dev');
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    req.sessionStore.all
        ? req.sessionStore.all((error, sessions) => {
            console.log(sessions);
            next();
        })
        : next();
});
app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/stories', videoRouter);
export default app;
