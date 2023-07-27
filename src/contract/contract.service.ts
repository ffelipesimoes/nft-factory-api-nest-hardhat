import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'hardhat';
import { NETWORK_URLS } from '../networks';
import { DeployContractDto } from './DeployContract.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  async deployContract(props: DeployContractDto): Promise<string> {
    this.logger.verbose('STARTING CONTRACT CREATION');

    const networkUrl = NETWORK_URLS[props.networkName];
    if (!networkUrl) {
      throw new Error(`Unsupported network: ${props.networkName}`);
    }
    this.logger.debug('Network selected:', props.networkName);

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Missing PRIVATE_KEY environment variable');
    }

    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const NFTFactory = await ethers.getContractFactory('NFTFactory', wallet);
    const nftFactory = await NFTFactory.deploy(
      props.tokenName,
      props.tokenSymbol,
    );
    await nftFactory.deployed();

    const contractAddress = nftFactory.address;
    this.logger.verbose('CONTRACT CREATION FINISHED');
    this.logger.debug('Contract deployed to address:', contractAddress);
    this.logger.verbose('STARTING CONTRACT VERIFICATION');

    const { networkName, tokenName, tokenSymbol } = props;
    this.eventEmitter.emit('verifyContract', {
      networkName,
      contractAddress,
      tokenName,
      tokenSymbol,
    });

    // await new Promise((resolve) => setTimeout(resolve, 30000));

    // try {
    //   const stdout = await exec(
    //     `npx hardhat verify --network ${props.networkName} ${contractAddress} ${props.tokenName} ${props.tokenSymbol}`,
    //   );
    //   this.logger.debug('stdout: ', stdout);
    // } catch (error) {
    //   this.logger.error('Failed to verify contract:', error);
    //   throw error;
    // }

    // this.logger.verbose('CONTRACT VERIFICATED');

    return contractAddress;
  }
}
