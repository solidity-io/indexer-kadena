'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Block.init({
    nonce: DataTypes.BIGINT,
    creationTime: DataTypes.BIGINT,
    parent: DataTypes.STRING,
    adjacents: DataTypes.JSONB,
    target: DataTypes.STRING,
    payloadHash: DataTypes.STRING,
    chainId: DataTypes.INTEGER,
    weight: DataTypes.STRING,
    height: DataTypes.INTEGER,
    chainwebVersion: DataTypes.STRING,
    epochStart: DataTypes.BIGINT,
    featureFlags: DataTypes.INTEGER,
    hash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Block',
  });
  return Block;
};