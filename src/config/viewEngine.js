import express from 'express';
import path from 'path';

let ConfigviewEngine  =(app) => {
    // Static files
    app.use(express.static("./src/public"))
    //EJS tempalte Engine
    app.set('view engine',  'ejs'); 
    app.set('views','./src/views'); 
    
}


module.exports = ConfigviewEngine;