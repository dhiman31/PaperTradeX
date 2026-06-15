'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(
      'Watchlists',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        symbol: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }
    );

    await queryInterface.addConstraint(
      'Watchlists',
      {
        fields: [
          'userId',
          'symbol'
        ],
        type: 'unique',
        name: 'unique_user_symbol'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      'Watchlists'
    );
  }
};