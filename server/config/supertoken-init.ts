import Session from 'supertokens-node/recipe/session'
import { TypeInput } from "supertokens-node/types";
import Passwordless from "supertokens-node/recipe/passwordless";
import Dashboard from "supertokens-node/recipe/dashboard";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });

// create supertokens config
export const SuperTokensConfig: TypeInput = {
    framework: "express",
    supertokens: {
        connectionURI: "http://localhost:3567"
    },
    appInfo: {
        appName: "AMS",
        apiDomain: `http://localhost:${process.env.BACKEND_PORT}`,
        apiBasePath: "/auth",
        websiteDomain: `http://localhost:${process.env.FRONTEND_PORT}`,
        websiteBasePath: "/login"
    },
    recipeList: [
        Passwordless.init({
            flowType: "USER_INPUT_CODE",
            contactMethod: "EMAIL"
        }),
        Session.init(),
        Dashboard.init({
            apiKey: 'abcd'
        })
    ]
};
