'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    userId: {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    orderType: {
      type : DataTypes.ENUM('MARKET','LIMIT'),
      allowNull : false
    },
    transactionType: {
      type : DataTypes.ENUM('BUY','SELL'),
      allowNull : false
    },
    status : {
      type : DataTypes.ENUM('PENDING','COMPLETED','CANCELLED','FAILED'),
      allowNull : false
    },
    symbol: {
      type : DataTypes.STRING,
      allowNull : false
    },
    amount: {
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
    modelName: 'Order',
  });
  return Order;
};