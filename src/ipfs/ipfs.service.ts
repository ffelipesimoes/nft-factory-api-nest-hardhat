import { Injectable } from '@nestjs/common';
import { NFTStorage, File } from 'nft.storage';

@Injectable()
export class IpfsService {
  private readonly API_KEY = process.env.NFT_STORAGE_API_KEY;

  async storeAsset(file: Express.Multer.File): Promise<string> {
    const client = new NFTStorage({ token: this.API_KEY });
    const metadata = await client.store({
      name: 'ExampleNFT',
      description: 'My ExampleNFT is an awesome artwork!',
      image: new File([file.buffer], file.originalname, {
        type: file.mimetype,
      }),
    });
    console.log('Metadata stored on Filecoin and IPFS with URL:', metadata.url);
    return metadata.url;
  }
}
