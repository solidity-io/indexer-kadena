'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Transactions', 'nonce', {
      type: Sequelize.TEXT, // Equivalent to TEXT in SQL when using Sequelize
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Transactions', 'nonce', {
      type: Sequelize.STRING, // Equivalent to VARCHAR(255) in SQL when using Sequelize
    });
  },
};
