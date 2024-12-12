"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex("Guards", {
      name: "guards_publickey_chainid_account_unique_idx",
      fields: ["publicKey", "chainId", "account"],
      unique: true,
    });

    await queryInterface.addIndex("Guards", {
      name: "guards_publickey_idx",
      fields: ["publicKey"],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "Guards",
      "guards_publicKey_chainId_account_unique_idx",
    );

    await queryInterface.removeIndex("Guards", "guards_publickey_idx");
  },
};
