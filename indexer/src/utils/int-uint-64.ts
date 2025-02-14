/** Since postgres doesn't have uint64 and we are just interested in the bits
 * of the number, these functions help to convert between unsigned and
 * signed 64-bit integers.
 * **/

const INT64_MIN = BigInt('-9223372036854775808');
const INT64_MAX = BigInt('9223372036854775807');
const UINT64_MAX = BigInt('18446744073709551615'); // 2^64 - 1

export function uint64ToInt64(uint64Value: any): bigint {
  const bigIntValue = BigInt(uint64Value);

  // Ensure the value is in the valid uint64 range
  if (bigIntValue < 0n || bigIntValue > UINT64_MAX) {
    throw new Error('Value is out of range for uint64');
  }

  if (bigIntValue <= INT64_MAX) {
    return bigIntValue;
  } else {
    return bigIntValue - UINT64_MAX - 1n;
  }
}

export function int64ToUint64String(bigintString: any) {
  const UINT64_WRAPAROUND = BigInt('18446744073709551616'); // 2^64

  const int64Value = BigInt(bigintString);

  // Validate the range for int64
  if (int64Value < INT64_MIN || int64Value > INT64_MAX) {
    throw new RangeError('Value is out of range for int64');
  }

  // Convert int64 to uint64
  const uint64Value = int64Value < 0n ? int64Value + UINT64_WRAPAROUND : int64Value;

  return uint64Value.toString();
}
