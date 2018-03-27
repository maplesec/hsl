import express from 'express';
import db from './mongodb/db.js';
import router from './routes/index';
const app = express();

router(app);

app.listen(3000);

console.log("listen 3000");