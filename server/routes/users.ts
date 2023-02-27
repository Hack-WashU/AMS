import { Router, Request, Response } from 'express';

const UserRouter = Router();

UserRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

export default UserRouter;
