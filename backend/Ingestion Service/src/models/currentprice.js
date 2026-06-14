'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CurrentPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CurrentPrice.init({
    symbol: {
      type : DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    currentPrice: {
      type : DataTypes.DECIMAL(18,8),
      allowNull: false
    },
    openPrice: {
      type : DataTypes.DECIMAL(18,8)
    },
    highPrice: {
      type : DataTypes.DECIMAL(18,8)
    },
    lowPrice: {
      type : DataTypes.DECIMAL(18,8)
    },
    updatedAt: {
      type : DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'CurrentPrice',
  });
  return CurrentPrice;
};