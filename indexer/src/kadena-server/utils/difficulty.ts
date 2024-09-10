export interface BlockWithDifficulty {
  creationTime: number;
  creationTimeDate: Date;
  difficulty: bigint;
  height: bigint;
  chainId: bigint;
}

interface IBlockGroup {
  [key: string]: BlockWithDifficulty[];
}

export function calculateTotalDifficulty(
  currentHeight: bigint,
  blocks: BlockWithDifficulty[],
  chainIds: number[],
): bigint | undefined {
  for (let i = currentHeight; i > currentHeight - 4n; i--) {
    const blocksOfThisHeight = blocks.filter((block) => block.height === i);

    if (blocksOfThisHeight.length === chainIds.length) {
      const totalDifficulty = blocksOfThisHeight.reduce(
        (acc, block) => acc + block.difficulty,
        0n,
      );
      return totalDifficulty;
      // Deal with the case where we have orphan blocks.
    } else if (blocksOfThisHeight.length > chainIds.length) {
      const blocksGroupedByChainId = blocksOfThisHeight.reduce<IBlockGroup>(
        (acc, block) => {
          const chainIdKey = block.chainId.toString();
          if (!acc[chainIdKey]) {
            acc[chainIdKey] = [];
          }
          acc[chainIdKey].push(block);
          return acc;
        },
        {},
      );

      let totalDifficulty = 0n;
      for (const chainId of chainIds) {
        const blocks = blocksGroupedByChainId[chainId.toString()];

        if (blocks) {
          const chainDifficulty = blocks.reduce(
            (acc, block) => acc + block.difficulty,
            0n,
          );

          // If there are multiple blocks, we average their difficulties.
          totalDifficulty += chainDifficulty / BigInt(blocks.length);
        }
      }
      return totalDifficulty;
    }

    // If we don't have enough blocks, use the previous block's difficulty.
    return BigInt(-1);
  }
}

function base64UrlToBigIntLittleEndian(base64UrlString: any) {
  // Replace base64url specific characters with standard base64 characters
  const base64 = base64UrlString.replace(/-/g, "+").replace(/_/g, "/");

  // Pad the base64 string with '=' to make it valid
  const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

  // Decode the base64 string into a Buffer (Node.js compatible)
  const byteArray = Buffer.from(paddedBase64, "base64");

  // Reverse the byte array to handle little-endian encoding
  const reversedByteArray = Uint8Array.from(byteArray).reverse();

  // Convert the reversed byte array to BigInt
  let bigIntValue = 0n;
  for (let byte of reversedByteArray) {
    bigIntValue = (bigIntValue << 8n) + BigInt(byte);
  }

  return bigIntValue;
}

function targetToDifficulty(targetBigInt: any) {
  const maxTarget = 2n ** 256n - 1n;
  return maxTarget / targetBigInt;
}

export function calculateBlockDifficulty(targetBase64Url: string) {
  const targetBigInt = base64UrlToBigIntLittleEndian(targetBase64Url);
  const difficulty = targetToDifficulty(targetBigInt);
  return difficulty;
}
