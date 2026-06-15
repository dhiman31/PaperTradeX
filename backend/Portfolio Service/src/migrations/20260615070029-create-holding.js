'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Holdings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull:false
      },
      quantity: {
        type: Sequelize.DECIMAL(18,8),
        allowNull:false,
        defaultValue:0
      },
      avgBuyPrice: {
        type: Sequelize.DECIMAL(18,8),
        allowNull:false,
        defaultValue:0
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

    await queryInterface.addConstraint('Holdings',{
      fields:[
        'userId',
        'symbol'
      ],
      type:'unique',
      name:'unique_user_symbol'
    }
  );
  
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Holdings');
  }
};