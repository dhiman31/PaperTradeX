'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Watchlist extends Model {
    static associate(models) {
    }
  }
  Watchlist.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Watchlist',
      tableName: 'Watchlists',
      indexes: [
        {
          unique: true,
          fields: [
            'userId',
            'symbol'
          ]
        }
      ]
    }
  );

  return Watchlist;

};