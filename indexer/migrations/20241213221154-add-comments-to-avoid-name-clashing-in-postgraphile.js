'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      COMMENT ON TABLE "public"."Guards" IS E'@name GuardsPg';
      COMMENT ON TABLE "public"."Signers" IS E'@name SignersPg';
  `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      COMMENT ON TABLE "public"."Guards" IS NULL;
      COMMENT ON TABLE "public"."Signers" IS NULL;
    `);
  },
};
