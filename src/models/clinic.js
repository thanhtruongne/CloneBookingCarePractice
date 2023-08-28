'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  // tạo các trường sql  
  Clinic.init({
    //KHÔNG CẦN PHẢI khai báo primarykey (Id)
    name:DataTypes.STRING,
    address: DataTypes.STRING,
    descriptionHTML: DataTypes.TEXT,
    descriptionContent: DataTypes.TEXT,
    image: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};