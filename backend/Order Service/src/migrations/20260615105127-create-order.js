'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
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
      orderType: {
        type: Sequelize.ENUM('MARKET','LIMIT'),
        allowNull : false
      },
      transactionType: {
        type: Sequelize.ENUM('BUY','SELL'),
        allowNull : false
      },
      status : {
        type: Sequelize.ENUM('PENDING','COMPLETED','CANCELLED','FAILED'),
        allowNull : false,
        defaultValue : 'PENDING'
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull : false
      },
      amount: {
        type: Sequelize.DECIMAL(18,8),
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

    // Index on userId
    await queryInterface.addIndex('Orders', ['userId'], {
      name: 'idx_orders_userId'
    });

    // Index on symbol
    await queryInterface.addIndex('Orders', ['symbol'], {
      name: 'idx_orders_symbol'
    });

    // Index on createdAt
    await queryInterface.addIndex('Orders', ['createdAt'], {
      name: 'idx_orders_createdAt'
    });

    // Composite index
    await queryInterface.addIndex('Orders', ['userId', 'symbol'], {
      name: 'idx_orders_userId_symbol'
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Orders', 'idx_orders_userId');
    await queryInterface.removeIndex('Orders', 'idx_orders_symbol');
    await queryInterface.removeIndex('Orders', 'idx_orders_createdAt');
    await queryInterface.removeIndex('Orders', 'idx_orders_userId_symbol');
    await queryInterface.dropTable('Orders');
  }
};