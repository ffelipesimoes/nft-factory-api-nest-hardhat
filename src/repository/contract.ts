import { PrismaClient } from '@prisma/client';
import { DeployedContractProps } from '../contract/contract.service';

const prisma = new PrismaClient();

export async function createContract(
  props: DeployedContractProps,
): Promise<DeployedContractProps> {
  const {
    networkName,
    contractAddress,
    tokenName,
    tokenSymbol,
    contractOwner,
    transactionHash,
    blockHash,
    blockNumber,
  } = props;
  const data = await prisma.contract.create({
    data: {
      networkName,
      contractAddress,
      tokenName,
      tokenSymbol,
      contractOwner,
      transactionHash,
      blockHash,
      blockNumber,
    },
  });
  return data;
}
