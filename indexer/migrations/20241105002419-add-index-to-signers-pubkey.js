'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('Signers', {
      fields: ['pubkey'],
      name: 'signers_pubkey_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Signers', 'signers_pubkey_idx');
  },
};
