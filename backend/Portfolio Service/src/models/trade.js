'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trade.init({
    userId: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    symbol: {
      type : DataTypes.STRING,
      allowNull : false
    },
    tradeType : {
      type: DataTypes.ENUM("BUY","SELL"),
      allowNull : false
    },
    quantity: {
      type : DataTypes.DECIMAL(18,8),
      allowNull : false
    },
    price: {
      type : DataTypes.DECIMAL(18,8),
      allowNull : false
    },
    totalAmount: {
      type : DataTypes.DECIMAL(18,8),
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'Trade',
  });
  return Trade;
};