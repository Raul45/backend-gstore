import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

@Injectable()
export class FileService {
  private readonly basePath = '/var/www/html/images';

  async upload(
    file: Express.Multer.File,
    folder: string,
    identifier?: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    const extension = extname(file.originalname).toLowerCase();
    const fileName = `${randomUUID()}${extension}`;

    const folderPath = identifier
      ? join(this.basePath, folder, identifier)
      : join(this.basePath, folder);

    await mkdir(folderPath, {
      recursive: true,
    });

    const filePath = join(folderPath, fileName);

    await writeFile(filePath, file.buffer);

    return identifier
      ? `/images/${folder}/${identifier}/${fileName}`
      : `/images/${folder}/${fileName}`;
  }

  async uploadMany(
    files: Express.Multer.File[],
    folder: string,
    identifier?: string,
  ): Promise<string[]> {
    return Promise.all(files.map((file) => this.upload(file, folder, identifier)));
  }

  async delete(url: string): Promise<void> {
    if (!url) {
      return;
    }

    const relativePath = url.replace(/^\/images\//, '');
    const filePath = join(this.basePath, relativePath);

    try {
      await unlink(filePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async deleteMany(urls: string[]): Promise<void> {
    await Promise.all(urls.map((url) => this.delete(url)));
  }
}
