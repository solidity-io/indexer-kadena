import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

type RewardRow = [number, number];

function calculateReward(csvContent: string, cutHeight: number): number {
  const parsed = Papa.parse<RewardRow>(csvContent, {
    delimiter: ',',
    skipEmptyLines: true,
    transformHeader: undefined,
    transform: (value, fieldIndex) => (fieldIndex === 0 ? parseInt(value, 10) : parseFloat(value)),
  });

  const averageHeight = cutHeight / 20; // number of chains

  let totalReward = 0;

  for (let i = 0; i < parsed.data.length; i += 1) {
    const row = parsed.data[i];
    const previousHeight = i === 0 ? 0 : parsed.data[i - 1][0];
    const height = row[0];
    const reward = row[1];

    if (averageHeight < height) {
      const remainingHeight = averageHeight - previousHeight;
      const proportionedReward = remainingHeight * reward;
      totalReward += proportionedReward;
      break;
    }

    totalReward = totalReward + reward * (height - previousHeight);
  }

  return totalReward;
}

type CsvRow = [string, string, string, number, number];

function calculateTokenPayments(csvContent: string, targetTimestamp: number): number {
  const parsed = Papa.parse<CsvRow>(csvContent, {
    delimiter: ',',
    skipEmptyLines: true,
    transform: (value, fieldIndex) => {
      if (fieldIndex === 3 || fieldIndex === 4) {
        return parseFloat(value);
      }
      return value;
    },
  });

  let totalSum = 0;
  let previousRow: CsvRow | null = null;

  const targetDate = new Date(targetTimestamp / 1000);
  for (const row of parsed.data) {
    const creationTimeISO = row[1];
    const amount = row[3];

    const creationDate = new Date(creationTimeISO);
    if (targetDate < creationDate) {
      break;
    }

    totalSum += amount;
    previousRow = row;
  }

  return totalSum;
}

async function getCsvContent(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function getMinerRewards(cutHeight: number) {
  const filePath = path.resolve(__dirname, '../../circulating-coins/miner_rewards.csv');
  const csvContent = await getCsvContent(filePath);
  const reward = calculateReward(csvContent, cutHeight);
  return reward;
}

async function getTokenPayments(latestCreationTime: number) {
  const filePath = path.resolve(__dirname, '../../circulating-coins/token_payments.csv');
  const csvContent = await getCsvContent(filePath);
  const tokenPayments = calculateTokenPayments(csvContent, latestCreationTime);
  return tokenPayments;
}

export async function getCirculationNumber(cutHeight: number, latestCreationTime: number) {
  const minerRewards = await getMinerRewards(cutHeight);
  const tokenPayments = await getTokenPayments(latestCreationTime);
  return minerRewards + tokenPayments;
}
