import { Injectable } from '@nestjs/common';
import { ethers } from 'hardhat';
import { Logger } from 'ethers/lib/utils';
import { NETWORK_URLS } from '../networks';

@Injectable()
export class MintService {
  private readonly logger = new Logger(MintService.name);

  async mintNFT(
    network: string,
    contractAddress: string,
    metaDataURL: string,
    tokenReceiver: string,
  ): Promise<any> {
    const networkUrl = NETWORK_URLS[network];
    if (!networkUrl) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Missing PRIVATE_KEY environment variable');
    }

    const provider = new ethers.providers.JsonRpcProvider(networkUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const NFTFactory = await ethers.getContractFactory('NFTFactory', wallet);
    const nftFactory = NFTFactory.attach(contractAddress);

    // const data = await nftFactory
    //   .mintNFT(tokenReceiver, metaDataURL, {
    //     from: wallet.address,
    //   })
    //   .encodeAbi();
    // const gas = provider.estimateGas({
    //   to: nftFactory.address,
    //   data,
    //   from: wallet.address,
    // });
    const tx = await nftFactory.mintNFT(tokenReceiver, metaDataURL);

    const receipt = await tx.wait();
    console.log(receipt);
    this.logger.debug('NFT minted to:', tokenReceiver);
    const res = {
      owner: tokenReceiver,
      receipt,
    };
    return res;
  }
}
