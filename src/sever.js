import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import viewEngine from './config/viewEngine'
import route from './routes/index';
import connectDB from './config/connectDB'
import methodOverride  from 'method-override'
import cors from 'cors'
require('dotenv').config();

let app = express();

// methodOverride
app.use(methodOverride('_method'));


// cors
app.use(cors());


// config app
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// Connect to database SQL
connectDB();

viewEngine(app);
route(app)

let port = process.env.PORT || 8080;

app.listen(port, () => {    
    console.log('Sever are connect and running on ' + port)
    console.log(path.join(__dirname,'public'))
})
