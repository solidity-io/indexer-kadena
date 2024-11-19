export function convertStringToDate(timestampInMicrosecondsString: any) {
  // Ensure the input is a string
  if (typeof timestampInMicrosecondsString !== "string") {
    throw new Error("The input timestamp must be a string.");
  }

  // Convert the string to a BigInt
  const timestampInMicroseconds = BigInt(timestampInMicrosecondsString);

  // Convert the BigInt microseconds to milliseconds by dividing by 1000n
  const timestampInMillisecondsBigInt = timestampInMicroseconds / 1000n;

  // Maximum safe integer for JavaScript Numbers
  const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);

  // Check if the timestamp is within the safe integer range
  if (timestampInMillisecondsBigInt <= MAX_SAFE_INTEGER) {
    // Convert to Number safely
    const timestampInMilliseconds = Number(timestampInMillisecondsBigInt);

    // Create a Date object and convert to ISO string
    return new Date(timestampInMilliseconds);
  } else {
    // Handle the case where the BigInt is too large to convert
    throw new Error(
      "The timestamp is too large to safely convert to a JavaScript number.",
    );
  }
}
