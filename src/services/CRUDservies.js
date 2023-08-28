import bcrypt from "bcrypt";
import db from '../models/index'

const salt = bcrypt.genSaltSync(12);

let CreateNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let HashPasswordBcrypt = await hashPasswordUser(data.password);
            await db.User.create({
                email: data.email,
                password: HashPasswordBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })

            resolve();
        } catch (error) {
            reject(error)
        }
    })

}

let hashPasswordUser = (password) => {
    // sử dụng Promise xử lý bất dồng bộ
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findAll({
                raw: true
            });
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}


let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataUserFindOne = await db.User.findOne({
                where: { id: userId },
                raw: true
            })
            if (dataUserFindOne) {
                resolve(dataUserFindOne)
            }
            else {
                resolve([])
            }
        } catch (error) {
            reject(error)
        }
    })
}


let getPutEditCRUD = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataUser = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })

            if (dataUser) {
                dataUser.firstName = data.firstName
                dataUser.lastName = data.lastName
                dataUser.address = data.address

                await dataUser.save();
                resolve();
            }
            else {
                resolve([]);
            }

        } catch (error) {
            reject(error)
        }

    })
}

let getDeleteUserCRUD = (Userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataUser = await db.User.destroy({
                where: { id: Userid }
            })
            resolve(dataUser)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    CreateNewUser: CreateNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    getPutEditCRUD: getPutEditCRUD,
    getDeleteUserCRUD: getDeleteUserCRUD
}