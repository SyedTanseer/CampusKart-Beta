// This file defines Multer types for Express
declare namespace Express {
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
      // Make stream optional to match multer's definition
      stream?: any;
    }
  }

  // Ensure Request interface includes file and files properties
  interface Request {
    file?: Multer.File;
    files?: {
      [fieldname: string]: Multer.File[];
    } | Multer.File[];
  }
}

// Fix FileFilterCallback in multer module
declare module 'multer' {
  // Export FileFilterCallback with the correct signature
  interface FileFilterCallback {
    (error: Error | null, acceptFile: boolean): void;
  }

  // Define the Multer interface to ensure Router() works
  interface Multer {
    diskStorage(options: any): any;
    single(fieldname: string): any;
    array(fieldname: string, maxCount?: number): any;
    fields(fields: Array<{ name: string; maxCount?: number }>): any;
    none(): any;
  }

  // Define multer as both a function and an object with these methods
  const multer: ((options?: any) => any) & Multer;
  export = multer;
}

// Make sure this file is treated as a module
export {}; 