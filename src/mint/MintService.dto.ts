import { IsNotEmpty, IsString } from 'class-validator';

export class MintServiceDto {
  @IsNotEmpty()
  @IsString()
  networkName: string;

  @IsNotEmpty()
  @IsString()
  contractAddress: string;

  @IsNotEmpty()
  @IsString()
  metaDataURL: string;

  @IsNotEmpty()
  @IsString()
  tokenReceiver: string;
}
