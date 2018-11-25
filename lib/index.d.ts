import { NextFunction, Request, Response, Router } from 'express';
export declare const createRouter: CreateRouter;
interface Route<R> {
    action: (x: object | null) => Promise<R>;
    beforeware?: Array<(Request: any, res: Response, next: NextFunction) => void>;
    createParam?: (req: Request) => object;
    method: 'get' | 'post' | 'put' | 'delete';
    path: string;
}
interface PostAsyncHandler<R> {
    (req: Request, res: Response, next: NextFunction): (R: R) => R;
}
interface CreateRouter {
    <R>(routes: Route<R>[], postAsyncHandlers: PostAsyncHandler<R>[]): Router;
}
export {};
//# sourceMappingURL=index.d.ts.map