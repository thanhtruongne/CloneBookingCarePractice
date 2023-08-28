import express from 'express';
import Crud from './CRUD'
import Home from './home'
import Usercontroller from './User'
import DoctorController from './DoctorHome'
const router = express.Router();

function route(app) {
    
    app.use('/v1',Usercontroller)

    app.use('/v2',DoctorController)

    app.use('/CRUD',Crud);
    
    app.use('/',Home)
    
    

}

module.exports = route;