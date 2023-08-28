import db from '../models/index';

import {
    CreateNewUser,
    getAllUser,
    getUserInfoById,
    getPutEditCRUD,
    getDeleteUserCRUD
} from '../services/CRUDservies'

class CRUD {
    //  [POST] /postCRUD
    async postCRUD(req, res, next) {
        let message = await CreateNewUser(req.body)
        res.redirect('/CRUD/getCRUD')
    }

    //[GET] /getCRUD
    async displaygetCRUD(req, res, next) {
        let dataUser = await getAllUser();
        res.render('displayCRUD.ejs', {
            dataTablet: dataUser
        })
    }

    //[GET] /edit-crud
    async getEditCRUD(req, res, next) {
        let userId = req.query.id
        if (userId) {
            let userData = await getUserInfoById(userId)
            return res.render('EditCRUD.ejs', {
                userData: userData
            })
        }
        else {
            return res.send('Edit Failed')
        }
    }

    //[PUT] /edit-crud 
    async putCURD(req, res, next) {
        let dataUserUpdate = await getPutEditCRUD(req.body);
        // dataUserUpdate.save();
        res.redirect('/CRUD/getCRUD');
    }

    //[DELETE] /delete-crud
    async deleteCURD(req, res, next) {
        await getDeleteUserCRUD(req.params.id); 
        res.redirect('/CRUD/getCRUD');
    }

}


module.exports = new CRUD();