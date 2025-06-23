'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Drop foreign key constraints first
    await queryInterface.removeConstraint('PoolTransactions', 'PoolTransactions_pairId_fkey');
    await queryInterface.removeConstraint('PoolCharts', 'PoolCharts_pairId_fkey');
    await queryInterface.removeConstraint('PoolStats', 'PoolStats_pairId_fkey');
    await queryInterface.removeConstraint('LiquidityBalances', 'LiquidityBalances_pairId_fkey');

    // Step 2: Update foreign key columns to STRING type
    await queryInterface.changeColumn('PoolTransactions', 'pairId', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('PoolCharts', 'pairId', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('PoolStats', 'pairId', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('LiquidityBalances', 'pairId', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Step 3: Update the Pairs table id column
    await queryInterface.changeColumn('Pairs', 'id', {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    });

    // Step 4: Re-add foreign key constraints
    await queryInterface.addConstraint('PoolTransactions', {
      fields: ['pairId'],
      type: 'foreign key',
      name: 'PoolTransactions_pairId_fkey',
      references: {
        table: 'Pairs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('PoolCharts', {
      fields: ['pairId'],
      type: 'foreign key',
      name: 'PoolCharts_pairId_fkey',
      references: {
        table: 'Pairs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('PoolStats', {
      fields: ['pairId'],
      type: 'foreign key',
      name: 'PoolStats_pairId_fkey',
      references: {
        table: 'Pairs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('LiquidityBalances', {
      fields: ['pairId'],
      type: 'foreign key',
      name: 'LiquidityBalances_pairId_fkey',
      references: {
        table: 'Pairs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Drop foreign key constraints
    await queryInterface.removeConstraint('PoolTransactions', 'PoolTransactions_pairId_fkey');
    await queryInterface.removeConstraint('PoolCharts', 'PoolCharts_pairId_fkey');
    await queryInterface.removeConstraint('PoolStats', 'PoolStats_pairId_fkey');
    await queryInterface.removeConstraint('LiquidityBalances', 'LiquidityBalances_pairId_fkey');

    // Step 2: Revert foreign key columns back to INTEGER type
    await queryInterface.changeColumn('PoolTransactions', 'pairId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('PoolCharts', 'pairId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('PoolStats', 'pairId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('LiquidityBalances', 'pairId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Step 3: Revert the Pairs table id column back to INTEGER with auto-increment
    await queryInterface.changeColumn('Pairs', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    });

    // Step 4: Re-add foreign key constraints
    await queryInterface.addConstraint('PoolTransactions', {
      fields: ['pairId'],
      type: 'foreign key',
      name: 'PoolTransactions_pairId_fkey',
      references: {
        table: 'Pairs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('PoolCharts', {
      fields: ['pairId'],
      type: 'foreign key',
      name: 'PoolCharts_pairId_fkey',
      references: {
        table: 'Pairs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('PoolStats', {
      fields: ['pairId'],
      type: 'foreign key',
      name: 'PoolStats_pairId_fkey',
      references: {
        table: 'Pairs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('LiquidityBalances', {
      fields: ['pairId'],
      type: 'foreign key',
      name: 'LiquidityBalances_pairId_fkey',
      references: {
        table: 'Pairs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
