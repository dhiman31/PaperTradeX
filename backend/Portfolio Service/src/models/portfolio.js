'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Portfolio.init({
    userId: {
      type : DataTypes.INTEGER,
      allowNull : false,
      unique : true
    },
    cashBalance: {
      type : DataTypes.DECIMAL,
      allowNull : false
    },
    initialBalance: {
      type : DataTypes.DECIMAL,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'Portfolio',
  });
  return Portfolio;
};