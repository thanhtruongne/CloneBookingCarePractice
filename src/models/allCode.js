'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Allcode.hasMany(models.User,{foreignKey:'postisionId',as :'postisionData'}),
      Allcode.hasMany(models.User,{foreignKey:'gender',as :'genderData'})

      //Schedules
      Allcode.hasMany(models.Schedule,{foreignKey:'timeType',as :'TimeData'})
      
      //Doctor_info
      Allcode.hasMany(models.doctor_info,{foreignKey:'priceId',as :'PriceData'})
      Allcode.hasMany(models.doctor_info,{foreignKey:'provinceId',as :'ProvinceIdData'})
      Allcode.hasMany(models.doctor_info,{foreignKey:'paymentsId',as :'PaymentsIdData'})
      
      //Booking
      Allcode.hasMany(models.Booking,{foreignKey:'timeType',as:'Time'})

    }
  }
  // Modal allcode
  Allcode.init({
    //KHÔNG CẦN PHẢI khai báo primarykey (Id)
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    // Tiếng anh
    valueEn: DataTypes.STRING, 
    // Tiếng việt
    valueVi: DataTypes.STRING, 
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
};