var _a;
import mongoose from 'mongoose';
mongoose.connect((_a = process.env.DB_URL) !== null && _a !== void 0 ? _a : '');
const db = mongoose.connection;
const handleOpen = () => console.log('✅ Connected to DB');
const handleError = (error) => console.log(`❌ Error: ${error}`);
db.on('error', handleError);
db.once('open', handleOpen);
