'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Blocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nonce: {
        type: Sequelize.BIGINT
      },
      creationTime: {
        type: Sequelize.BIGINT
      },
      parent: {
        type: Sequelize.STRING
      },
      adjacents: {
        type: Sequelize.JSONB
      },
      target: {
        type: Sequelize.STRING
      },
      payloadHash: {
        type: Sequelize.STRING
      },
      chainId: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.INTEGER
      },
      chainwebVersion: {
        type: Sequelize.STRING
      },
      epochStart: {
        type: Sequelize.BIGINT
      },
      featureFlags: {
        type: Sequelize.INTEGER
      },
      hash: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Blocks');
  }
};