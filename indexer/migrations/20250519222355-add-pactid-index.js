'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('TransactionDetails', {
      fields: ['pactid'],
      name: 'transactiondetails_pactid_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('TransactionDetails', 'transactiondetails_pactid_idx');
  },
};
