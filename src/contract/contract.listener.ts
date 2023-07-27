import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

interface Iprops {
  networkName: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
}

const exec = promisify(execCb);

@Injectable()
export class VerifyContractHandler {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(VerifyContractHandler.name);
  }

  @OnEvent('verifyContract')
  async handle(props: Iprops): Promise<void> {
    this.logger.log(`event verifyContract received | ${JSON.stringify(props)}`);
    const { contractAddress, networkName, tokenName, tokenSymbol } = props;
    await sleep(30000);
    try {
      const stdout = await exec(
        `npx hardhat verify --network ${networkName} ${contractAddress} ${tokenName} ${tokenSymbol}`,
      );
      this.logger.log('stdout: ', stdout);
    } catch (error) {
      this.logger.error(error);
      throw new Error(JSON.stringify(error));
    }
    this.logger.log('CONTRACT VERIFICATED');
  }
}
