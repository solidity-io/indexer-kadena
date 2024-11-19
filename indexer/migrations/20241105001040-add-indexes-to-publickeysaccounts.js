"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex("PublicKeysAccounts", {
      name: "publickeysaccounts_publickey_chainid_account_module_unique_idx",
      fields: ["publicKey", "chainId", "account", "module"],
      unique: true,
    });

    await queryInterface.addIndex("PublicKeysAccounts", {
      name: "publickeysaccounts_publickey_idx",
      fields: ["publicKey"],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "PublicKeysAccounts",
      "publickeysaccounts_publicKey_chainId_account_module_unique_idx",
    );

    await queryInterface.removeIndex(
      "PublicKeysAccounts",
      "publickeysaccounts_publickey_idx",
    );
  },
};
