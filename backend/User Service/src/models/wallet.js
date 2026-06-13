'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey : 'userId',
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE',
        as : 'user'
      })
    }
  }
  Wallet.init({
    userId: {
      type : DataTypes.INTEGER,
      unique : true,
      allowNull : false
    },
    initialBalance: {
      type : DataTypes.DECIMAL(18,8),
      defaultValue : '10000.00000000'
    },
    currentBalance: {
      type : DataTypes.DECIMAL(18,8),
      defaultValue : '10000.00000000'
    }
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  return Wallet;
};