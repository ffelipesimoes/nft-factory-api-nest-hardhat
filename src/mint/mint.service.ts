import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'hardhat';
import { NETWORK_URLS, TRANSACTION_EXPLORER_URLS } from '../networks';

@Injectable()
export class MintService {
  private readonly logger = new Logger(MintService.name);

  async mintNFT(
    network: string,
    contractAddress: string,
    metaDataURL: string,
    tokenReceiver: string,
  ): Promise<any> {
    this.logger.verbose('STARTING MINTING SERVICE');

    const networkUrl = NETWORK_URLS[network];
    if (!networkUrl) {
      throw new Error(`Unsupported network: ${network}`);
    }
    this.logger.debug('Network selected:', network);

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Missing PRIVATE_KEY environment variable');
    }

    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const NFTFactory = await ethers.getContractFactory('NFTFactory', wallet);
    this.logger.log(`Attaching contract... ${contractAddress}`);

    const nftFactory = NFTFactory.attach(contractAddress);

    const mint = await nftFactory.mintNFT(tokenReceiver, metaDataURL);
    this.logger.log(`Minting NFT on: ${contractAddress}`);

    const receipt = await mint.wait();
    this.logger.debug('NFT minted to:', tokenReceiver);
    const res = {
      Receiver: tokenReceiver,
      BlockNumber: receipt.blockNumber,
      Tx: `${TRANSACTION_EXPLORER_URLS[network]}/${receipt.transactionHash}`,
      Contract: contractAddress,
      Network: network,
      metaDataURL,
    };
    this.logger.debug(res);

    return res;
  }
}
