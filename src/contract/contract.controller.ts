import { Controller, Post, Body } from '@nestjs/common';
import { ContractService } from './contract.service';

export interface DeployedContractProps {
  address: string;
  url: string;
}
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('deploy')
  async deploy(
    @Body('network') network: string,
  ): Promise<DeployedContractProps> {
    const address = await this.contractService.deployContract(network);
    const url = `https://mumbai.polygonscan.com/address/${address}`;
    return { address, url };
  }
}
