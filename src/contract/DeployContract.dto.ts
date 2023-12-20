import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class DeployContractDto {
  @ApiProperty({
    description: 'Network Name',
    example: 'sepolia',
    default: 'sepolia',
  })
  @IsNotEmpty()
  @IsString()
  networkName: string;

  @ApiProperty({
    description: 'Token Name',
    example: 'Token do Leao',
    default: 'Meu token',
  })
  @IsNotEmpty()
  @IsString()
  tokenName: string;

  @ApiProperty({
    description: 'Token Symbol',
    example: 'NFT',
    default: 'NFTT',
  })
  @IsNotEmpty()
  @IsString()
  tokenSymbol: string;
}
