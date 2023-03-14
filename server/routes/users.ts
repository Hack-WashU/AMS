import { Router, Request, Response } from 'express';
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from "supertokens-node/framework/express";
import { fetchUser } from '../scripts/firstlogin';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
const UserRouter = Router();

UserRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

UserRouter.get('/:id', verifySession(), async (req: SessionRequest, res: Response) => {
    console.log("Request Made")
    // fetch user data & return it
    let userid = req.session!.getUserId();
    console.log("User ID: ", userid)
    try {
        const fetched = await fetchUser(userid);
        console.log(fetched);
        res.redirect(`http://${process.env.FRONTEND_DOMAIN}:${process.env.FRONTEND_PORT}/`);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
})

UserRouter.post('/login', (req: Request, res: Response) => {
    res.send('Hello World!');
});

export default UserRouter;
