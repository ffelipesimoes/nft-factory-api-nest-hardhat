export interface DeployContractResponseDto {
  networkName: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  contractOwner: string;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  url: string;
}
