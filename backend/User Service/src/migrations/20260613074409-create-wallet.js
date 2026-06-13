'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Users',
          key : 'id'
        },
        onDelete:'CASCADE',
        onUpdate : 'CASCADE',
        allowNull : false,
        unique : true
      },
      initialBalance: {
        type: Sequelize.DECIMAL(18, 8),
        defaultValue : 10000.00000000
      },
      currentBalance: {
        type: Sequelize.DECIMAL(18, 8),
        defaultValue : 10000.00000000
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
    await queryInterface.dropTable('Wallets');
  }
};