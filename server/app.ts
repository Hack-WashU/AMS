import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import bodyParser from 'body-parser';

import supertokens from 'supertokens-node'
import { middleware, errorHandler } from 'supertokens-node/framework/express'
import { SuperTokensConfig } from './config/supertoken-init'
supertokens.init(SuperTokensConfig)

dotenv.config({ path: '../.env' });

const app: Express = express();

// Define Express middleware
app.use(bodyParser.json());
app.use(cors({
    origin: `http://localhost:${process.env.FRONTEND_PORT}`,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
}))

const port = process.env.BACKEND_PORT;

// Define external routes

// Defines supertokens auth routes
app.use(middleware());

app.use(errorHandler())

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${process.env.BACKEND_PORT}`);
});
