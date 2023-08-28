'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class doctor_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      doctor_info.belongsTo(models.User,{foreignKey:'doctorId'});
      
      //ALLCODES
      doctor_info.belongsTo(models.Allcode,{foreignKey:'priceId',targetKey:'keyMap',as :'PriceData'});
      doctor_info.belongsTo(models.Allcode,{foreignKey:'provinceId',targetKey:'keyMap',as :'ProvinceIdData'});
      doctor_info.belongsTo(models.Allcode,{foreignKey:'paymentsId',targetKey:'keyMap',as :'PaymentsIdData'});
    }
  }
  // tạo các trường sql  
  doctor_info.init({
    //KHÔNG CẦN PHẢI khai báo primarykey (Id)
     doctorId : DataTypes.INTEGER,
     priceId : DataTypes.STRING,
     provinceId : DataTypes.STRING,
     paymentsId : DataTypes.STRING,
     specialtyId : DataTypes.STRING,
     clinicId : DataTypes.STRING,
     addressClinic : DataTypes.STRING,
     nameClinic : DataTypes.STRING,
     note : DataTypes.STRING,
     count : DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'doctor_info',
  });
  return doctor_info;
};