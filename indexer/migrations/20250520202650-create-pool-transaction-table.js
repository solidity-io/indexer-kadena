'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PoolTransactions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'The unique identifier for the pool transaction record',
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
      transactionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'The ID of the associated transaction',
      },
      requestkey: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'The request key of the transaction',
      },
      type: {
        type: Sequelize.ENUM('SWAP', 'ADD_LIQUIDITY', 'REMOVE_LIQUIDITY'),
        allowNull: false,
        comment: 'The type of transaction',
      },
      maker: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'The address of the transaction maker',
      },
      amount0In: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'Amount of token0 input',
      },
      amount1In: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'Amount of token1 input',
      },
      amount0Out: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'Amount of token0 output',
      },
      amount1Out: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'Amount of token1 output',
      },
      amountUsd: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total amount in USD',
      },
      feeAmount: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'Fee amount in tokens',
      },
      feeUsd: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Fee amount in USD',
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'When the transaction occurred',
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
    await queryInterface.addIndex('PoolTransactions', ['pairId', 'timestamp'], {
      name: 'pool_transactions_pairid_timestamp_idx',
    });
    await queryInterface.addIndex('PoolTransactions', ['transactionId'], {
      name: 'pool_transactions_transactionid_idx',
    });
    await queryInterface.addIndex('PoolTransactions', ['requestkey'], {
      name: 'pool_transactions_requestkey_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PoolTransactions');
  },
};
