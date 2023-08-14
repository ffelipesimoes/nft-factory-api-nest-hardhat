import { Controller, Post, Body } from '@nestjs/common';
import { ContractService, DeployedContractProps } from './contract.service';
import { CONTRACT_ADRRESS_EXPLORER_URLS } from '../networks';
import { DeployContractDto } from './DeployContract.dto';

export interface DeployedContractControllerProps {
  response: DeployedContractProps;
  url: string;
}
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('deploy')
  async deploy(
    @Body() deployContractDto: DeployContractDto,
  ): Promise<DeployedContractControllerProps> {
    const response = await this.contractService.deployContract(
      deployContractDto,
    );

    const url = `${
      CONTRACT_ADRRESS_EXPLORER_URLS[deployContractDto.networkName]
    }/${response.contractAddress}`;
    return { response, url };
  }
}
