import express from 'express';
import { globalRouter } from './routers/globalRouter';
import { userRouter } from './routers/userRouter';
import { storyRouter } from './routers/storyRouter';
import morgan from 'morgan';

const PORT = 4000;
const app = express();
const logger = morgan('dev');

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use('/', globalRouter);
app.use('/users', userRouter);
app.use('/stories', storyRouter);

const listner = () => console.log(`Server is listening on port ${PORT}`);
app.listen(PORT, listner);
