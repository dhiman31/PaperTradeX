'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull : false
      },
      quantity: {
        type: Sequelize.DECIMAL,
        allowNull : false
      },
      tradeType :{
        type: Sequelize.ENUM(
          "BUY","SELL"
        ),
        allowNull : false
      },
      price: {
        type: Sequelize.DECIMAL(18,8),
        allowNull : false
      },
      totalAmount: {
        type: Sequelize.DECIMAL(18,8),
        allowNull : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Trades');
  }
};