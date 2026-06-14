'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CurrentPrices', {
      symbol: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull : false
      },
      currentPrice: {
        type: Sequelize.DECIMAL(18,8),
        allowNull: false
      },
      openPrice: {
        type: Sequelize.DECIMAL(18,8)
      },
      highPrice: {
        type: Sequelize.DECIMAL(18,8)
      },
      lowPrice: {
        type: Sequelize.DECIMAL(18,8)
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CurrentPrices');
  }
};