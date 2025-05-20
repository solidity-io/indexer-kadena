'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tokens', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      decimals: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalSupply: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
      },
      tokenInfo: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          decimalsToDisplay: 8,
          description: '',
          themeColor: '#000000',
          discordUrl: '',
          mediumUrl: '',
          telegramUrl: '',
          twitterUrl: '',
          websiteUrl: '',
        },
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
    await queryInterface.addIndex('Tokens', ['address']);
    await queryInterface.addIndex('Tokens', ['code']);
    await queryInterface.addIndex('Tokens', ['symbol']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Tokens');
  },
};
