export const getNonFungibleAccountBase64ID = (accountName: string): string => {
  const inputString = `NonFungibleAccount:${accountName}`;
  const base64ID = Buffer.from(inputString, 'utf-8').toString('base64');
  return base64ID;
};

export const getNonFungibleChainAccountBase64ID = (
  chainId: string,
  accountName: string,
): string => {
  const inputString = `NonFungibleChainAccount:[\"${chainId}\",\"${accountName}\"]`;
  const base64ID = Buffer.from(inputString, 'utf-8').toString('base64');
  return base64ID;
};
