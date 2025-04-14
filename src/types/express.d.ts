declare module 'express' {
  import { EventEmitter } from 'events';
  import * as http from 'http';
  import * as net from 'net';

  export interface Request extends http.IncomingMessage {
    body: any;
    params: any;
    query: any;
    headers: any;
    user?: any;
  }

  export interface Response extends http.ServerResponse {
    status(code: number): Response;
    send(body: any): Response;
    json(body: any): Response;
  }

  export interface NextFunction {
    (err?: any): void;
  }

  export interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
  }

  export interface Router {
    get(path: string, ...handlers: RequestHandler[]): Router;
    post(path: string, ...handlers: RequestHandler[]): Router;
    put(path: string, ...handlers: RequestHandler[]): Router;
    delete(path: string, ...handlers: RequestHandler[]): Router;
    use(...handlers: RequestHandler[]): Router;
    use(path: string, ...handlers: RequestHandler[]): Router;
  }

  export function Router(): Router;
  export function json(): RequestHandler;
  export function urlencoded(options: { extended: boolean }): RequestHandler;
  export function static(root: string, options?: any): RequestHandler;

  export default function createApplication(): any;
} 