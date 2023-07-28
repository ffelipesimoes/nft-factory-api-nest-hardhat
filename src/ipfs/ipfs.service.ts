import { Injectable } from '@nestjs/common';
import { NFTStorage, File } from 'nft.storage';

@Injectable()
export class IpfsService {
  private readonly API_KEY = process.env.NFT_STORAGE_API_KEY;

  async storeAsset(file: Express.Multer.File, metadata: any): Promise<string> {
    const client = new NFTStorage({ token: this.API_KEY });
    const metadataObj = JSON.parse(metadata);

    const { name, description } = metadataObj;
    console.log(metadataObj);
    console.log(name);
    console.log(description);
    const metadataStored = await client.store({
      name,
      description,
      image: new File([file.buffer], file.originalname, {
        type: file.mimetype,
      }),
      ...metadata, // This will add all other metadata fields to the stored metadata
    });
    console.log(
      'Metadata stored on Filecoin and IPFS with URL:',
      metadataStored.url,
    );
    return metadataStored.url;
  }
}
