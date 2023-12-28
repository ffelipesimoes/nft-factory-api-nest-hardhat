import { Controller, Post, Body } from '@nestjs/common';
import { ContractService, DeployedContractProps } from './contract.service';
import { CONTRACT_ADRRESS_EXPLORER_URLS } from '../networks';
import { DeployContractDto } from './dto/deploy-contract-request.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeployContractResponseDto } from './dto/deploy-contract-response.dto';

@ApiTags('Deploy Contract')
@ApiCreatedResponse({
  status: 201,
  description: 'Contract deployed',
  type: DeployContractDto,
})
@ApiBadRequestResponse({ status: 500, description: 'Deu ruim' })
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('deploy')
  async deploy(
    @Body() deployContractDto: DeployContractDto,
  ): Promise<DeployContractResponseDto> {
    const response = await this.contractService.deployContract(
      deployContractDto,
    );

    return response;
  }
}
