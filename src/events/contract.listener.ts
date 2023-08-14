import { Injectable, Logger } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { network, run } from 'hardhat';
import { sleep } from '../utils';
import { createContract } from '../repository/contract';
import { DeployedContractProps } from '../contract/contract.service';

// export interface Iprops {
//   networkName: string;
//   contractAddress: string;
//   tokenName: string;
//   tokenSymbol: string;
// }

@Injectable()
export class VerifyContractHandler {
  private readonly logger: Logger;

  constructor(private eventEmitter: EventEmitter2) {
    this.logger = new Logger(VerifyContractHandler.name);
  }

  @OnEvent('verifyContract')
  async handle(props: DeployedContractProps): Promise<void> {
    this.logger.log(`event verifyContract received | ${JSON.stringify(props)}`);
    this.logger.debug('STARTING CONTRACT VERIFICATION');

    await sleep(30000);

    try {
      const { contractAddress, networkName, tokenName, tokenSymbol } = props;
      network.name = networkName;
      if (process.env.ETHERSCAN_API_KEY) {
        await run('verify:verify', {
          address: contractAddress,
          constructorArguments: [tokenName, tokenSymbol],
        });
        this.logger.log('Contract verified');
      }
      this.logger.debug(
        `CONTRACT  ${contractAddress} VERIFICATED on ${networkName}`,
      );
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.toLowerCase().includes('already verified')) {
          this.logger.log('Contract Already verified!');
        } else {
          this.logger.error(e.message);
        }
      } else {
        this.logger.error(e);
      }
    }

    this.eventEmitter.emit('persistContract', {
      props,
    });
    this.logger.debug('END OF CONTRACT VERIFICATION', props);
  }

  async persistContract(props: DeployedContractProps): Promise<string> {
    const {
      contractAddress,
      networkName,
      tokenName,
      tokenSymbol,
      contractOwner,
      transactionHash,
      blockHash,
      blockNumber,
    } = props;
    network.name = networkName;

    this.logger.log(
      `event persistContract received | ${JSON.stringify(props)}`,
    );
    this.logger.debug('STARTING DB PERSISTANCE ');

    try {
      await createContract(props);
      this.logger.log('Data Persisted');
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e.message);
      }
    }

    return `DATA  ${props} PERSISTED on DB`;
  }
}
