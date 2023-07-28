import { IsNotEmpty, IsString } from 'class-validator';
export class DeployContractDto {
  @IsNotEmpty()
  @IsString()
  networkName: string;

  @IsNotEmpty()
  @IsString()
  tokenName: string;

  @IsNotEmpty()
  @IsString()
  tokenSymbol: string;
}
