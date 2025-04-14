// This file provides typings for Express application methods

import * as core from 'express-serve-static-core';
import { RequestHandler, Router, Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';

declare global {
  namespace Express {
    interface Application extends core.Express {
      use: Function;
      get: Function;
      post: Function;
      put: Function;
      delete: Function;
      listen: Function;
    }
  }
}

// Add typing for express module
declare module 'express' {
  // Re-export Express types to ensure they're compatible
  export type Request = ExpressRequest;
  export type Response = ExpressResponse;
  export type NextFunction = ExpressNextFunction;
  
  // Define Express interface for the module itself
  interface Express {
    (): Express.Application;
    json(): RequestHandler;
    urlencoded(options: { extended: boolean }): RequestHandler;
    static(root: string, options?: any): RequestHandler;
    Router(): Router;
  }

  // Export the express factory function
  const express: Express & ((options?: any) => Express.Application);
  export = express;
  export default express;
  
  // Add express namespace to be compatible with how the codebase uses it
  namespace express {
    type Request = Express.Request;
    type Response = Express.Response;
    type NextFunction = Express.NextFunction;
  }
}

// Enhance express-serve-static-core
declare module 'express-serve-static-core' {
  interface Express {
    use(...handlers: any[]): any;
    listen(port: number, callback?: () => void): any;
  }
}

// Make sure this file is treated as a module
export {};