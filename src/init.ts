import './db';
import './models/Video';
import app from './server';

const PORT = 4000;

const handleListening = () => {
  console.log(`Server Listening on port ${PORT}`);
};

app.listen(PORT, handleListening);
