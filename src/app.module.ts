import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractService } from './contract/contract.service';
import { ContractController } from './contract/contract.controller';
import { IpfsService } from './ipfs/ipfs.service';
import { IpfsController } from './ipfs/ipfs.controller';

@Module({
  imports: [],
  controllers: [AppController, ContractController, IpfsController],
  providers: [AppService, ContractService, IpfsService],
})
export class AppModule {}
