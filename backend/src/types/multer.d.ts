declare module 'multer' {
  import { Request, Response, NextFunction } from 'express';

  namespace multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
      stream?: any;
    }

    interface FileFilterCallback {
      (error: Error | null, acceptFile: boolean): void;
    }

    interface StorageEngine {
      _handleFile(req: Request, file: File, callback: (error?: any, info?: Partial<File>) => void): void;
      _removeFile(req: Request, file: File, callback: (error: Error) => void): void;
    }

    interface DiskStorageOptions {
      destination?: string | ((req: Request, file: File, callback: (error: Error | null, destination: string) => void) => void);
      filename?: (req: Request, file: File, callback: (error: Error | null, filename: string) => void) => void;
    }

    interface Options {
      dest?: string;
      storage?: StorageEngine;
      limits?: {
        fieldNameSize?: number;
        fieldSize?: number;
        fields?: number;
        fileSize?: number;
        files?: number;
        parts?: number;
        headerPairs?: number;
      };
      fileFilter?: (req: Request, file: File, callback: FileFilterCallback) => void;
    }
  }

  interface Multer {
    (options?: multer.Options): any;
    diskStorage(options: multer.DiskStorageOptions): multer.StorageEngine;
    single(fieldname: string): (req: Request, res: Response, next: NextFunction) => void;
    array(fieldname: string, maxCount?: number): (req: Request, res: Response, next: NextFunction) => void;
    fields(fields: Array<{ name: string; maxCount?: number }>): (req: Request, res: Response, next: NextFunction) => void;
    none(): (req: Request, res: Response, next: NextFunction) => void;
  }

  const multer: Multer & { default?: Multer };
  export = multer;
  
  export default function multer(options?: multer.Options): Multer;
  export interface FileFilterCallback extends multer.FileFilterCallback {}
}

declare global {
  namespace Express {
    namespace Multer {
      interface File extends multer.File {
        stream: any;
      }
    }
  }
} 