'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Holding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Holding.init({
    userId: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    symbol: {
      type : DataTypes.STRING,
      allowNull : false
    },
    quantity: {
      type : DataTypes.DECIMAL(18,8),
      allowNull : false
    },
    avgBuyPrice: {
      type : DataTypes.DECIMAL(18,8),
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'Holding',
  });
  return Holding;
};