'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Allcode,{foreignKey: 'timeType' ,targetKey:'keyMap',as:'TimeData'});
    }
  }
  // tạo các trường sql  
  Schedule.init({
    //KHÔNG CẦN PHẢI khai báo primarykey (Id)
    currentNumber: DataTypes.INTEGER,
    maxNumber: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    doctorId: DataTypes.STRING, 
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};