// This file resolves compatibility issues with Express and Multer

import { RequestHandler, Router } from 'express';
import * as core from 'express-serve-static-core';

// Fix express application type
declare global {
  namespace Express {
    interface Application {
      use: any;
      get: any;
      post: any;
      put: any;
      delete: any;
      listen: any;
    }
  }
}

// Enhance the express module
declare module 'express' {
  // Fix the express function itself
  interface Express {
    (): Express.Application;
    json(): RequestHandler;
    urlencoded(options: { extended: boolean }): RequestHandler;
    static(root: string, options?: any): RequestHandler;
    Router(): Router;
  }
  
  // Allow express.Router() to work
  interface ExpressStatic {
    Router(): Router;
    json(): RequestHandler;
    static(root: string, options?: any): RequestHandler;
  }
  
  // Export express with both types
  const express: Express & ExpressStatic;
  export = express;
  export default express;
}

// Fix Request compatibility issues
declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    [key: string]: string;
  }
  
  // Make the files property compatible with multer
  interface Request {
    files?: any;
    file?: any;
  }
}

// Normalize the Multer namespace
declare module 'multer' {
  interface Multer {
    diskStorage: (options: any) => any;
    single(fieldname: string): any;
    array(fieldname: string, maxCount?: number): any;
    fields(fields: Array<{ name: string; maxCount?: number }>): any;
    none(): any;
  }
  
  const multer: Multer & { default?: Multer };
  export = multer;
}

// Make sure this file is treated as a module
export {}; 