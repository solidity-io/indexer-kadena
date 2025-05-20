'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LiquidityBalances', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'The unique identifier for the liquidity balance record',
      },
      pairId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'The ID of the associated pair',
        references: {
          model: 'Pairs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      liquidity: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'The amount of liquidity tokens held',
      },
      walletAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'The wallet address holding the liquidity',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add indexes for efficient querying
    await queryInterface.addIndex('LiquidityBalances', ['pairId', 'walletAddress'], {
      unique: true,
      name: 'liquidity_balances_pairid_walletaddress_unique',
    });
    await queryInterface.addIndex('LiquidityBalances', ['pairId'], {
      name: 'liquidity_balances_pairid_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LiquidityBalances');
  },
};
