import express from 'express'
import Usercontroller from '../controller/Usercontroller'

let router = express.Router();
//API check validate đăng nhập
router.post('/api/login',Usercontroller.handeUserLogin);

//API GET data(for Redux)
router.get('/api/getAllUser',Usercontroller.getAllUser); 

//API client user client
router.post('/api/createuser',Usercontroller.createUserClient);
router.put('/api/edituser',Usercontroller.editUserClient);
router.delete('/api/deleteuser',Usercontroller.deleteUserClient);

router.get('/allcode',Usercontroller.GetAllCode)


module.exports = router;
