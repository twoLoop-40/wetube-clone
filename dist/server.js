import express from 'express';
const PORT = 4000;
const app = express();
const logger = () => console.log(`Server is listening on port ${PORT}`);
app.listen(PORT, logger);
