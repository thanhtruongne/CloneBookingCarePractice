'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
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
  Specialty.init({
    //KHÔNG CẦN PHẢI khai báo primarykey (Id)
    name:DataTypes.STRING,
    image: DataTypes.STRING,
    markdownHTML : DataTypes.TEXT,
    markdownContent : DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Specialty',
  });
  return Specialty;
};