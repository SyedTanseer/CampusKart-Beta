// This file provides type definition overrides using 'any' type to ensure compatibility

declare module 'express' {
  // Make express function return 'any'
  function express(): any;
  
  // Add missing properties to express
  namespace express {
    function json(): any;
    function urlencoded(options: any): any;
    function static(root: string, options?: any): any;
    function Router(): any;
    
    interface Request {
      user?: any;
      file?: any;
      files?: any;
    }
    
    interface Response {
      [key: string]: any;
    }
    
    interface Application {
      use: any;
      get: any;
      post: any;
      put: any;
      delete: any;
      listen: any;
    }
  }
  
  export = express;
}

// Fix multer compatibility issues
declare module 'multer' {
  function multer(options?: any): any;
  namespace multer {
    function diskStorage(options: any): any;
    function memoryStorage(): any;
    
    interface File {
      [key: string]: any;
    }
  }
  
  export = multer;
}

// Make sure this file is treated as a module
export {}; 