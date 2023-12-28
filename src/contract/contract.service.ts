import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'hardhat';
import { CONTRACT_ADRRESS_EXPLORER_URLS, NETWORK_URLS } from '../networks';
import { DeployContractDto } from './dto/deploy-contract-request.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeployContractResponseDto } from './dto/deploy-contract-response.dto';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  async deployContract(
    deployContractDto: DeployContractDto,
  ): Promise<DeployContractResponseDto> {
    const { networkName, tokenName, tokenSymbol } = deployContractDto;

    this.logger.verbose('STARTING CONTRACT CREATION');

    const networkUrl = NETWORK_URLS[networkName];
    if (!networkUrl) {
      throw new Error(`Unsupported network: ${networkName}`);
    }
    this.logger.debug('Network selected:', networkName);

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Missing PRIVATE_KEY environment variable');
    }

    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const NFTFactory = await ethers.getContractFactory('NFTFactory', wallet);
    const nftFactory = await NFTFactory.deploy(tokenName, tokenSymbol);
    await nftFactory.deployed();

    const transactionReceipt = await nftFactory.deployTransaction.wait();
    const {
      from: contractOwner,
      contractAddress,
      transactionHash,
      blockHash,
      blockNumber,
    } = transactionReceipt;

    this.logger.verbose('CONTRACT CREATION FINISHED');
    this.logger.debug('Contract deployed to address:', contractAddress);

    const url = `${CONTRACT_ADRRESS_EXPLORER_URLS[networkName]}/${contractAddress}`;

    const response = {
      networkName,
      contractAddress,
      tokenName,
      tokenSymbol,
      contractOwner,
      transactionHash,
      blockHash,
      blockNumber,
      url,
    };

    this.eventEmitter.emit('verifyContract', {
      response,
    });

    return response;
  }
}
