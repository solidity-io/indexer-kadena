'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pairs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token0Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tokens',
          key: 'id',
        },
      },
      token1Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tokens',
          key: 'id',
        },
      },
      reserve0: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
      },
      reserve1: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
      },
      totalSupply: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes
    await queryInterface.addIndex('Pairs', ['token0Id']);
    await queryInterface.addIndex('Pairs', ['token1Id']);
    await queryInterface.addIndex('Pairs', ['address']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Pairs');
  },
};
