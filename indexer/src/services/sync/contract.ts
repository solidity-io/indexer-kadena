import { handleSingleQuery } from "../../kadena-server/utils/raw-query";
import Contract, { ContractAttributes } from "../../models/contract";

export async function syncContract(
  network: string,
  chainId: number,
  modulename: any,
  tokenId: any,
) {
  const manifestData = await handleSingleQuery({
    chainId: chainId.toString(),
    code: `(${modulename}.get-manifest "${tokenId}")`,
  });
  console.log("manifestData", manifestData);
  let contractId;
  if (manifestData) {
    contractId = await saveContract(
      network,
      chainId,
      modulename,
      "poly-fungible",
      tokenId,
      manifestData,
    );
  } else {
    console.log("No manifest URI found for token ID:", tokenId);
  }
  return contractId;
}

export async function saveContract(
  network: string,
  chainId: number,
  modulename: any,
  type: string,
  tokenId?: any,
  manifestData?: any,
  precision?: number,
) {
  const contractData = {
    network: network,
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
      network: contractData.network,
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

export async function getContract(
  network: string,
  chainId: number,
  modulename: any,
) {
  const contract = await Contract.findOne({
    where: {
      network: network,
      chainId: chainId,
      module: modulename,
    },
  });
  return contract;
}
