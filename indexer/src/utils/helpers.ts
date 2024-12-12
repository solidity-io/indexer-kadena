/**
 * Decodes a base64 encoded string into its original format and parses it as JSON.
 *
 * @param encodedData The base64 encoded string to be decoded.
 * @returns The decoded and parsed JSON object, or null if decoding or parsing fails.
 */
export function getDecoded(encodedData: string): any {
  const decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
  try {
    return JSON.parse(decodedData);
  } catch (error) {
    console.error("Error decoding data:", error);
    return null;
  }
}

/**
 * Introduces a delay in the execution flow.
 *
 * @param ms The amount of time in milliseconds to delay.
 * @returns A promise that resolves after the specified delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Splits a range into smaller chunks based on a specified size.
 * This function is useful for breaking down a large range of numbers into manageable parts,
 * for example, when processing data in batches.
 *
 * @param min The minimum value of the range to split.
 * @param max The maximum value of the range to split.
 * @param rangeSize The size of each chunk.
 * @returns An array of arrays, where each inner array represents a chunk with a start and end value.
 */
export function splitIntoChunks(
  min: number,
  max: number,
  rangeSize: number,
): number[][] {
  const chunks = [];
  let current = max;
  if (max - min <= rangeSize) {
    return [[min, max]];
  }
  while (current > min) {
    const next = Math.max(current - rangeSize, min);
    chunks.push([next, current]);
    current = next - 1;
  }
  return chunks;
}

/**
 * Calculates the size of a data object in bytes.
 *
 * @param data The data object to size.
 * @returns The size of the data in bytes.
 */
export function calculateDataSize(data: any) {
  return Buffer.byteLength(JSON.stringify(data), "utf8");
}

/**
 * Retrieves a required environment variable as a string.
 * Throws an error if the variable is not found, ensuring that the application configuration is correctly defined.
 *
 * @param key - The name of the environment variable to retrieve.
 * @returns The value of the environment variable as a string.
 * @throws {Error} If the environment variable is not set.
 */
export function getRequiredEnvString(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}

/**
 * Retrieves a required environment variable as a number.
 * Parses the variable value as an integer and throws an error if the variable is not found or if it cannot be parsed as a number.
 * This ensures that numeric environment configurations are valid and available before proceeding.
 *
 * @param key - The name of the environment variable to retrieve and parse as a number.
 * @returns The parsed value of the environment variable as a number.
 * @throws {Error} If the environment variable is not set or cannot be parsed as a valid number.
 */
export function getRequiredEnvNumber(key: string): number {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
}

/**
 * Creates a signal object that can be used to manage shutdown or interrupt signals in asynchronous operations.
 * It provides a mechanism to gracefully exit from a loop or terminate a process when an external signal is received.
 * The signal object contains a boolean flag that is initially set to false and can be toggled to true using the
 * trigger method. This flag can be checked periodically in asynchronous loops to determine if the process should
 * continue running or begin shutdown procedures.
 *
 * @returns An object with properties 'isTriggered' to check the current state of the signal,
 * and 'trigger' to change the state to triggered, indicating that a shutdown or interrupt has been requested.
 */
export function createSignal() {
  let isTriggered = false;
  return {
    get isTriggered() {
      return isTriggered;
    },
    trigger() {
      isTriggered = true;
    },
  };
}

export function uint64ToInt64(uint64Value: any): bigint {
  const bigIntValue = BigInt(uint64Value);
  const int64Max = BigInt("9223372036854775807"); // 2^63 - 1
  const uint64Max = BigInt("18446744073709551615"); // 2^64 - 1

  // Ensure the value is in the valid uint64 range
  if (bigIntValue < 0n || bigIntValue > uint64Max) {
    throw new Error("Value is out of range for uint64");
  }

  if (bigIntValue <= int64Max) {
    return bigIntValue;
  } else {
    return bigIntValue - uint64Max - 1n;
  }
}
