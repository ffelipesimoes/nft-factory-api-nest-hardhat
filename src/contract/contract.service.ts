import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'hardhat';
import { exec } from 'child_process';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  async deployContract(networkName: string): Promise<string> {
    this.logger.verbose('STARTING CONTRACT CREATION');

    let provider;
    if (networkName === 'polygonMumbai') {
      provider = new ethers.providers.JsonRpcProvider(
        'https://rpc-mumbai.maticvigil.com',
      );
    } else if (networkName === 'sepolia') {
      provider = new ethers.providers.JsonRpcProvider(
        'https://eth-sepolia.public.blastapi.io',
      );
    } else {
      throw new Error('Unsupported network');
    }
    this.logger.debug('Network selected:', networkName);

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const NFT = await ethers.getContractFactory('NFT', wallet);
    const nft = await NFT.deploy();
    await nft.deployed();

    const contractAddress = nft.address;
    this.logger.verbose('CONTRACT CREATION FINISHED');
    this.logger.debug('Contract deployed to address:', contractAddress);
    this.logger.verbose('STARTING CONTRACT VERIFICATION');

    await new Promise((resolve) => setTimeout(resolve, 30000));

    const start = process.hrtime();

    exec(
      `npx hardhat verify --network ${networkName} ${contractAddress}`,
      (error, stdout) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        this.logger.debug('stdout: ', stdout);

        const end = process.hrtime(start);
        this.logger.warn(`Execution time: ${end[0]}m ${end[1] / 1000000}ms`);
        this.logger.verbose('CONTRACT VERIFICATED');
      },
    );

    return contractAddress;
  }
}
