import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IpfsService } from './ipfs.service';

@Controller('upload')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Post('asset')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('metadata') metadata: any,
  ): Promise<string> {
    return this.ipfsService.storeAsset(file, metadata);
  }
}
