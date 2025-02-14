import { handleSingleQuery } from '../../kadena-server/utils/raw-query';
import Contract, { ContractAttributes } from '../../models/contract';

export async function syncContract(chainId: number, modulename: any, tokenId: any) {
  const manifestData = await handleSingleQuery({
    chainId: chainId.toString(),
    code: `(${modulename}.get-manifest "${tokenId}")`,
  });
  console.log('manifestData', manifestData);
  let contractId;
  if (!manifestData.error) {
    contractId = await saveContract(
      chainId,
      modulename,
      'poly-fungible',
      tokenId,
      manifestData.result,
    );
  } else {
    console.log('No manifest URI found for token ID:', tokenId);
  }
  return contractId;
}

export async function saveContract(
  chainId: number,
  modulename: any,
  type: string,
  tokenId?: any,
  manifestData?: any,
  precision?: number,
) {
  const contractData = {
    chainId: chainId,
    module: modulename,
    type: type,
    metadata: manifestData,
    tokenId: tokenId,
    precision: precision,
  } as ContractAttributes;
  let contractId;
  const existingContract = await Contract.findOne({
    where: {
      chainId: contractData.chainId,
      module: contractData.module,
      tokenId: tokenId,
    },
  });

  if (!existingContract) {
    const newContract = await Contract.create(contractData);
    contractId = newContract.id;
  } else {
    contractId = existingContract.id;
  }
  return contractId;
}

export async function getContract(chainId: number, modulename: any) {
  const contract = await Contract.findOne({
    where: {
      chainId: chainId,
      module: modulename,
    },
  });
  return contract;
}
