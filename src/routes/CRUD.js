import express from 'express';
import CRUD from '../controller/CRUD'

const router = express.Router();

    router.post('/postCRUD',CRUD.postCRUD);
    
    router.get('/getCRUD',CRUD.displaygetCRUD);
    
    router.get('/edit-crud',CRUD.getEditCRUD);

    router.put('/putCRUD',CRUD.putCURD);
    
    router.delete('/:id',CRUD.deleteCURD);

module.exports = router;
