'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //trường hợp quan hệ model
      User.belongsTo(models.Allcode,{foreignKey:'postisionId',targetKey:'keyMap',as:'postisionData'})
      User.belongsTo(models.Allcode,{foreignKey:'gender',targetKey:'keyMap',as:'genderData'}) 
      // quan hệ one -one
      User.hasOne(models.Markdown,{foreignKey :'doctorId'})

      //Info doctor
      User.hasOne(models.doctor_info,{foreignKey:'doctorId'});
      User.hasMany(models.Booking, {foreignKey:'patientId',as:'PatientData'});
    }
  }
  // tạo các trường sql  
  User.init({
    //KHÔNG CẦN PHẢI khai báo primarykey (Id)
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    image : DataTypes.STRING,
    dayofbirth : DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber : DataTypes.STRING,
    gender: DataTypes.STRING,
    roleId : DataTypes.STRING,
    postisionId : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};