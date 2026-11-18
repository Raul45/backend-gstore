import { Module } from '@nestjs/common';
import { FileService } from './files.service.js';

@Module({
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
