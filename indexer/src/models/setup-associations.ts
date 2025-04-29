import Pair from './pair';
import PoolChartData from './pool-chart-data';
import PoolStats from './pool-stats';
import PoolTransaction from './pool-transaction';
import Token from './token';

/**
 * Sets up all model associations in the application.
 * This function should be called after all models are initialized.
 */
export function setupAssociations() {
  // Token associations
  Token.hasMany(Pair, {
    foreignKey: 'token0Id',
    as: 'pairsAsToken0',
  });

  Token.hasMany(Pair, {
    foreignKey: 'token1Id',
    as: 'pairsAsToken1',
  });

  // Pair associations
  Pair.belongsTo(Token, {
    foreignKey: 'token0Id',
    as: 'token0',
  });

  Pair.belongsTo(Token, {
    foreignKey: 'token1Id',
    as: 'token1',
  });

  Pair.hasMany(PoolStats, {
    foreignKey: 'pairId',
    as: 'poolStats',
  });

  Pair.hasMany(PoolTransaction, {
    foreignKey: 'pairId',
    as: 'poolTransactions',
  });

  Pair.hasMany(PoolChartData, {
    foreignKey: 'pairId',
    as: 'poolChartData',
  });

  // PoolChartData associations
  PoolChartData.belongsTo(Pair, {
    foreignKey: 'pairId',
    as: 'pair',
  });

  // PoolStats associations
  PoolStats.belongsTo(Pair, {
    foreignKey: 'pairId',
    as: 'pair',
  });

  // PoolTransaction associations
  PoolTransaction.belongsTo(Pair, {
    foreignKey: 'pairId',
    as: 'pair',
  });
}
