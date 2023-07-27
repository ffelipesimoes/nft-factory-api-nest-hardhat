import { Body, Controller, Post } from '@nestjs/common';
import { MintService } from './mint.service';
import { MintServiceDto } from './MintService.dto';

export interface DeployedContractProps {
  owner: string;
  url: string;
}

@Controller('mint')
export class MintController {
  constructor(private readonly mintService: MintService) {}

  @Post()
  async deploy(
    @Body() mintServiceDto: MintServiceDto,
  ): Promise<DeployedContractProps> {
    const response = await this.mintService.mintNFT(
      mintServiceDto.networkName,
      mintServiceDto.contractAddress,
      mintServiceDto.metaDataURL,
      mintServiceDto.tokenReceiver,
    );
    console.log(mintServiceDto);

    return response;
  }
}
