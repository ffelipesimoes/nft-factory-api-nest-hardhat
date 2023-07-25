import { Controller, Post, Body } from '@nestjs/common';
import { ContractService } from './contract.service';
import { NETWORK_EXPLORER_URLS } from './networks';
import { DeployContractDto } from './DeployContract.dto';

export interface DeployedContractProps {
  address: string;
  url: string;
}
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('deploy')
  async deploy(
    @Body() deployContractDto: DeployContractDto,
  ): Promise<DeployedContractProps> {
    const address = await this.contractService.deployContract(
      deployContractDto,
    );
    const url = `${
      NETWORK_EXPLORER_URLS[deployContractDto.networkName]
    }/${address}`;
    return { address, url };
  }
}
