// This file resolves compatibility issues between Express and Multer
import * as multer from 'multer';
import { Request as ExpressRequest } from 'express';

// Add missing properties to express Request interface
declare global {
  namespace Express {
    // Define the Multer namespace
    namespace Multer {
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
    }

    // Extend Request interface to include file and files
    interface Request {
      file?: Multer.File;
      files?: {
        [fieldname: string]: Multer.File[];
      } | Multer.File[];
    }
  }
}

// Enhance the multer module
declare module 'multer' {
  interface File {
    stream?: any;
  }
  
  interface Multer {
    diskStorage: (options: multer.Options) => multer.StorageEngine;
    single(fieldname: string): (req: Request, res: any, next: any) => void;
    array(fieldname: string, maxCount?: number): (req: Request, res: any, next: any) => void;
    fields(fields: Array<{ name: string; maxCount?: number }>): (req: Request, res: any, next: any) => void;
    none(): (req: Request, res: any, next: any) => void;
  }
}

// Re-export the modified Request
export interface Request extends ExpressRequest {
  file?: multer.File;
  files?: {
    [fieldname: string]: multer.File[];
  } | multer.File[];
}

// Make sure this file is treated as a module
export {}; 