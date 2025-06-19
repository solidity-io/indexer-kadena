import { ResolverContext } from '../../../config/apollo-server-config';
import {
  Pool,
  TimeFrame,
  ChartDataPoint as GraphQLChartDataPoint,
} from '../../../config/graphql-types';

interface ChartDataPoint {
  timestamp: Date;
  value: number;
}

export const poolResolvers = {
  charts: async (
    parent: Pool,
    { timeFrame }: { timeFrame: TimeFrame },
    context: ResolverContext,
  ): Promise<{
    volume: GraphQLChartDataPoint[];
    tvl: GraphQLChartDataPoint[];
    fees: GraphQLChartDataPoint[];
  }> => {
    const charts = await context.poolRepository.getPoolCharts({
      pairId: parent.id,
      timeFrame,
    });

    const mapChartData = (data: ChartDataPoint[]): GraphQLChartDataPoint[] =>
      data.map(point => ({
        timestamp: point.timestamp,
        value: point.value,
      }));

    return {
      volume: mapChartData(charts.volume),
      tvl: mapChartData(charts.tvl),
      fees: mapChartData(charts.fees),
    };
  },
};
