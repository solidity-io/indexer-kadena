'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, convert existing timestamps to date-only format
    await queryInterface.sequelize.query(`
      UPDATE "PoolStats"
      SET timestamp = DATE(timestamp)
      WHERE timestamp IS NOT NULL;
    `);

    // Then change the column type to DATE
    await queryInterface.changeColumn('PoolStats', 'timestamp', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Convert back to TIMESTAMP WITH TIME ZONE
    await queryInterface.changeColumn('PoolStats', 'timestamp', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
