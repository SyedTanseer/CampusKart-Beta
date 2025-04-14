// This file fixes Express application typing issues

// Fix Express application interface
declare module 'express' {
  // Define the application interface
  interface Application {
    use: any;
    get: any;
    post: any;
    put: any;
    delete: any;
    listen: any;
  }

  // Define the Express interface (the module itself)
  interface Express {
    (): Application;
    json(): any;
    urlencoded(options: any): any;
    static(root: string, options?: any): any;
    Router(): any;
  }

  // Add missing properties to Request interface
  interface Request {
    body: any;
    params: any;
    query: any;
    headers: any;
    user?: any;
    file?: any;
    files?: any;
  }

  // Make Router type explicit
  export type RouterType = any;
  export function Router(): RouterType;

  // Define Express as a variable with those interfaces
  const express: Express;
  export = express;
}

// Make sure this file is treated as a module
export {}; 