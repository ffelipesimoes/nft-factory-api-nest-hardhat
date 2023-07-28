import { Injectable, Logger } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { network, run } from 'hardhat';
import { sleep } from 'src/utils';

interface Iprops {
  networkName: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
}

@Injectable()
export class VerifyContractHandler {
  private readonly logger: Logger;

  constructor(private eventEmitter: EventEmitter2) {
    this.logger = new Logger(VerifyContractHandler.name);
  }

  @OnEvent('verifyContract')
  async handle(props: Iprops): Promise<string> {
    const { contractAddress, networkName, tokenName, tokenSymbol } = props;
    network.name = networkName;

    this.logger.log(`event verifyContract received | ${JSON.stringify(props)}`);
    this.logger.debug('STARTING CONTRACT VERIFICATION');

    await sleep(30000);

    try {
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
    return `CONTRACT  ${contractAddress} VERIFICATED on ${networkName}`;
  }
}
