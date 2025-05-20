'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pairs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'The unique identifier for the pair',
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'The contract address of the pair',
      },
      token0Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'The ID of the first token in the pair',
        references: {
          model: 'Tokens',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      token1Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'The ID of the second token in the pair',
        references: {
          model: 'Tokens',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reserve0: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'The reserve amount of token0',
      },
      reserve1: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'The reserve amount of token1',
      },
      totalSupply: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0',
        comment: 'The total supply of LP tokens',
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique key for the pair',
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

    // Add unique constraint for token pair
    await queryInterface.addIndex('Pairs', ['token0Id', 'token1Id'], {
      unique: true,
      name: 'pairs_token0id_token1id_unique',
    });

    // Add index for address
    await queryInterface.addIndex('Pairs', ['address'], {
      name: 'pairs_address_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pairs');
  },
};
