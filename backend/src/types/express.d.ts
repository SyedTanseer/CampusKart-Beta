// This file extends Express types
import { RequestHandler } from 'express-serve-static-core';

declare module 'express' {
  interface Application {
    use: any;
    get: any;
    post: any;
    put: any;
    delete: any;
    listen: any;
  }

  interface Express {
    (): Application;
    json(): any;
    urlencoded(options: { extended: boolean }): any;
    static(root: string, options?: any): any;
    Router(): any;
  }

  const express: Express;
  export = express;
}

// Declare Express global namespace
declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: any;
      files?: any;
    }

    interface Response {
      status(code: number): Response;
      send(body: any): Response;
      json(body: any): Response;
    }
  }
}

// Make sure this file is treated as a module
export {};