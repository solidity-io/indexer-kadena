'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PoolCharts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'The unique identifier for the pool chart record',
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
      reserve0: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Token0 amount in pool',
      },
      reserve1: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Token1 amount in pool',
      },
      totalSupply: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Total LP tokens',
      },
      reserve0Usd: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'USD value of reserve0',
      },
      reserve1Usd: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'USD value of reserve1',
      },
      tvlUsd: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'Total USD value locked',
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'When this state was recorded',
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

    // Add index for efficient querying by pair and timestamp
    await queryInterface.addIndex('PoolCharts', ['pairId', 'timestamp'], {
      name: 'pool_charts_pairid_timestamp_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PoolCharts');
  },
};
