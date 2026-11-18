import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

export function ImageFilesInterceptor(fieldName = 'images', maxFiles = 10) {
  return FilesInterceptor(fieldName, maxFiles, {
    storage: multer.memoryStorage(),

    limits: {
      fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, callback) => {
      if (!file.mimetype.startsWith('image/')) {
        return callback(new Error('El archivo debe ser una imagen'), false);
      }

      callback(null, true);
    },
  });
}

export function ImageFileInterceptor(fieldName = 'file') {
  return FileInterceptor(fieldName, {
    storage: multer.memoryStorage(),

    limits: {
      fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, callback) => {
      if (!file.mimetype.startsWith('image/')) {
        return callback(new Error('El archivo debe ser una imagen'), false);
      }

      callback(null, true);
    },
  });
}
