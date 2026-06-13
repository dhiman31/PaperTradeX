'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Wallet , {
        foreignKey : 'userId',
        as : 'wallet'
      })
    }
  }
  User.init({
    firstName: {
      type : DataTypes.STRING
    },
    lastName: {
      type : DataTypes.STRING
    },
    email: {
      type : DataTypes.STRING,
      unique : true,
      allowNull : false,
      validate : {
        isEmail : true
      }
    },
    phoneNumber: {
      type : DataTypes.STRING,
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'User',

    hooks: {
        beforeCreate: async (user) => {
          if (user.passwordHash) {
            user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
          }
        },

        beforeUpdate: async (user) => {
          if (user.changed('passwordHash')) {
            user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
          }
        }
    }

  });
  return User;
};