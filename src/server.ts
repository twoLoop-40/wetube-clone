import express from 'express';
import { globalRouter } from './routers/globalRouter';
import { userRouter } from './routers/userRouter';
import { storyRouter } from './routers/storyRouter';

const PORT = 4000;
const app = express();

app.use('/', globalRouter);
app.use('/users', userRouter);
app.use('/story', storyRouter);
const listner = () => console.log(`Server is listening on port ${PORT}`);
app.listen(PORT, listner);
