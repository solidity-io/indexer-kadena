'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update amountUsd column from DECIMAL(20,2) to DECIMAL(20,10)
    await queryInterface.changeColumn('PoolTransactions', 'amountUsd', {
      type: Sequelize.DECIMAL(20, 10),
      allowNull: false,
      defaultValue: 0,
      comment: 'Transaction amount in USD with higher precision',
    });

    // Update feeUsd column from DECIMAL(20,2) to DECIMAL(20,10)
    await queryInterface.changeColumn('PoolTransactions', 'feeUsd', {
      type: Sequelize.DECIMAL(20, 10),
      allowNull: false,
      defaultValue: 0,
      comment: 'Fee amount in USD with higher precision',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert amountUsd column back to DECIMAL(20,2)
    await queryInterface.changeColumn('PoolTransactions', 'amountUsd', {
      type: Sequelize.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Transaction amount in USD',
    });

    // Revert feeUsd column back to DECIMAL(20,2)
    await queryInterface.changeColumn('PoolTransactions', 'feeUsd', {
      type: Sequelize.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Fee amount in USD',
    });
  },
};
