import { BlockWithDifficulty } from './difficulty';

function aggregateBlockData(blocks: { creationTimeDate: Date; difficulty: bigint }[]): {
  earliestTime: number;
  totalDifficulty: bigint;
} {
  let earliestTime = Number.MAX_SAFE_INTEGER;
  let totalDifficulty = 0n;

  for (const block of blocks) {
    const blockTimeMillis = block.creationTimeDate.getTime();
    if (blockTimeMillis < earliestTime) {
      earliestTime = blockTimeMillis;
    }
    totalDifficulty += block.difficulty;
  }

  return { earliestTime, totalDifficulty };
}

export function calculateNetworkHashRate(blocksWithDifficulty: BlockWithDifficulty[]): bigint {
  const { earliestTime, totalDifficulty } = aggregateBlockData(blocksWithDifficulty);

  const timeDifference = Date.now() - earliestTime;

  return timeDifference < 1000 ? 0n : totalDifficulty / (BigInt(timeDifference) / 1000n);
}
