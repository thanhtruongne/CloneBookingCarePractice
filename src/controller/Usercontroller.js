import db from '../models/index'
import {
    handeUserNewLogin,
    handleGetAllUsers,
    handleCreateNewUserClient,
    handleEditUserClient,
    handleDeleteUserClient,
    handleGetAllCode
} from '../services/UserServices'
class Usercontroller {
    async handeUserLogin(req, res, next) {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            return res.status(500).json({
                errCode: 1,
                message: 'Missing email or password . Please tries again.!!!!'
            })

        }
        let user = await handeUserNewLogin(email, password);

        return res.status(200).json({
            errCode: user.errCode,
            message: user.message,
            user: user.usercheck
        })
    }

    async getAllUser(req, res, next) {
        //s73 dụng params để frontend có thể lấy data
        let id = req.query.id // get id or All
        // console.log(id)
        let data = await handleGetAllUsers(id);
        return res.status(200).json({
            errCode: 0,
            message: 'Ok',
            data
        })
    }


    async createUserClient(req, res, next) {
        let dataUserClientNew = await handleCreateNewUserClient(req.body);
        return res.status(200).json(dataUserClientNew)
    }

    async editUserClient(req, res, next) {
        let dataEditUserClient = await handleEditUserClient(req.body);
        return res.status(200).json(dataEditUserClient)
    }

    async deleteUserClient(req, res, next) {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing input parameter!!!!'
            })
        }
        let dataDeleteUserClient = await handleDeleteUserClient(req.body.id);
        return res.status(200).json(dataDeleteUserClient)
    }

    async GetAllCode(req, res, next) {
        try {
            // sử dụng setTimeOut để hiện loading data
            setTimeout(async () => {
                let data = await handleGetAllCode(req.query.type);
                return res.status(200).json(data)
            }, 1000)
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                errCode: -1,
                message: 'Error from sever'
            })
        }
    }

   
}


module.exports = new Usercontroller();