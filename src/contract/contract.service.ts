import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'hardhat';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { NETWORK_URLS } from './networks';

const exec = promisify(execCb);

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  async deployContract(networkName: string): Promise<string> {
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

    const NFT = await ethers.getContractFactory('NFT', wallet);
    const nft = await NFT.deploy();
    await nft.deployed();

    const contractAddress = nft.address;
    this.logger.verbose('CONTRACT CREATION FINISHED');
    this.logger.debug('Contract deployed to address:', contractAddress);
    this.logger.verbose('STARTING CONTRACT VERIFICATION');

    await new Promise((resolve) => setTimeout(resolve, 30000));

    const start = process.hrtime();

    try {
      const stdout = await exec(
        `npx hardhat verify --network ${networkName} ${contractAddress}`,
      );
      this.logger.debug('stdout: ', stdout);
    } catch (error) {
      this.logger.error('Failed to verify contract:', error);
      throw error;
    }

    const end = process.hrtime(start);
    this.logger.warn(`Execution time: ${end[0]}m ${end[1] / 1000000}ms`);
    this.logger.verbose('CONTRACT VERIFICATED');

    return contractAddress;
  }
}
