import db from '../models/index'
import bcrypt from 'bcrypt'

const salt = bcrypt.genSaltSync(12);

let handeUserNewLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataUser = {};
            let isExist = await checkEmailUser(email);
            if (isExist) {
                let newUser = await db.User.findOne({
                    attributes: ['email', 'roleId', 'id', 'password'],
                    where: { email: email },
                    raw: true
                })
                if (newUser) {
                    let checkPass = await bcrypt.compareSync(password, newUser.password);
                    if (checkPass) {
                        dataUser.errCode = 0;
                        dataUser.message = 'Succes to connect !!!';
                        delete newUser.password;
                        dataUser.usercheck = newUser;
                    }
                    else {
                        dataUser.errCode = 3;
                        dataUser.message = 'Your password is incorrect !!!';
                    }
                }
                else {
                    dataUser.errCode = 2;
                    dataUser.message = 'User not found !!!'
                }

            }
            else {
                dataUser.errCode = 1;
                dataUser.message = 'Email has no exist in database Please try another email !!';
            }
            resolve(dataUser)


        } catch (error) {
            reject(error)
        }


    })
}

let checkEmailUser = (useremail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkdatauser = await db.User.findOne({
                where: { email: useremail }
            })
            if (checkdatauser) {
                resolve(true)
            }
            else {
                resolve(false)
            }
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

let handleGetAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = '';
            if (userId === 'All') {
                user = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                });
            }
            if (userId && userId !== 'All') {
                user = await db.User.findOne({
                    attributes: {
                        exclude: ['password']
                    },
                    where: { id: userId }
                })
            }
            resolve(user)

        } catch (error) {
            reject(error)
        }
    })
}

let handleCreateNewUserClient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is Exist
            let checkEmail = await checkEmailUser(data.email);

            if (checkEmail === true) {
                resolve({
                    errCode: 1,
                    message: "Email already exists. Try another email"
                })
            }
            else {
                let HashPasswordBcrypt = await hashPasswordUser(data.password);
                await db.User.create({
                    email: data.email,
                    password: HashPasswordBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    postisionId: data.postisionId,
                    image: data.image,
                })
                resolve({
                    errCode: 0,
                    message: 'Ok'
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let handleEditUserClient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter id !!!'
                })
            }
            // set raw false để xóa dc sẽ chuyển từ ogj sang sequelize obj
            let userUpdate = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (userUpdate) {
                userUpdate.firstName = data.firstName
                userUpdate.lastName = data.lastName
                userUpdate.address = data.address
                userUpdate.phoneNumber = data.phoneNumber
                userUpdate.gender = data.gender
                userUpdate.postisionId = data.postisionId
                userUpdate.roleId = data.roleId
                if(data.image) {
                    userUpdate.image = data.image
                }
            }

            await userUpdate.save();

            resolve({
                errCode: 0,
                message: 'User has been updated successfully !!!'
            })

        } catch (error) {
            reject(error)
        }
    })

}

let handleDeleteUserClient = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let findUser = await db.User.findOne({
                where: { id: userId },
                raw: false
            })
            if (!findUser) {
                resolve({
                    errCode: 2,
                    message: 'User doesnt exist in database'
                })
            }

            await db.User.destroy({
                where: { id: userId },
            })
            resolve({
                errCode: 0,
                message: 'User has been deleted !!!'
            })

        } catch (error) {
            reject(error)
        }
    })
}

let handleGetAllCode = (inputType) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputType) {
                resolve({
                    errCode: 2,
                    message: 'Missing parameter type'
                })
            }
            else {
                let data = {};
                let sub = await db.Allcode.findAll({
                    where: { type: inputType }
                })
                data.errCode = 0;
                data.sub = sub;
                resolve(data)
            }
        } catch (error) {
            reject(error)
        }
    })
}



module.exports = {
    handeUserNewLogin: handeUserNewLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUserClient: handleCreateNewUserClient,
    handleEditUserClient: handleEditUserClient,
    handleDeleteUserClient: handleDeleteUserClient,
    handleGetAllCode: handleGetAllCode,
}