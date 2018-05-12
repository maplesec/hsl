import express from 'express';
import session from 'express-session';
import db from './mongodb/db.js';
import router from './routes/index';
const app = express();

app.use(session({
    name: 'SID',
    secret: 'SID',
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure:false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.post('/login', function(req, res){
    req.session.user_id = '13'
    res.send({
        status: 1
    })
})

app.post('/logout', function(req, res){
    req.session.user_id = null
    res.send({
        status: 1
    })
})

router(app);

app.listen(3000);

console.log("listen 3000");