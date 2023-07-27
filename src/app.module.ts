import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractService } from './contract/contract.service';
import { ContractController } from './contract/contract.controller';
import { IpfsService } from './ipfs/ipfs.service';
import { IpfsController } from './ipfs/ipfs.controller';
import { MintController } from './mint/mint.controller';
import { MintService } from './mint/mint.service';

@Module({
  imports: [],
  controllers: [AppController, ContractController, IpfsController, MintController],
  providers: [AppService, ContractService, IpfsService, MintService],
})
export class AppModule {}
