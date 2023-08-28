import express from 'express';
import Hompage from '../controller/hompage';

const router = express.Router();

    //Phần Homepage
    router.get('/', Hompage.getHomePage);
    
    //Phần getCRUD 
    router.get('/about',Hompage.getCRUD);

module.exports = router;