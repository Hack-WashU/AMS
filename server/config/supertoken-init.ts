import Session from 'supertokens-node/recipe/session'
import { TypeInput } from "supertokens-node/types";
import Passwordless from "supertokens-node/recipe/passwordless";
import Dashboard from "supertokens-node/recipe/dashboard";
import dotenv from "dotenv";
import dotenvexpand from "dotenv-expand";
import {createUser, fetchUser} from "../scripts/firstlogin";

let env = dotenv.config({ path: '../.env' });
dotenvexpand.expand(env);

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
        websiteBasePath: "/auth"
    },
    recipeList: [
        Passwordless.init({
            flowType: "MAGIC_LINK",
            contactMethod: "EMAIL",

            override: {
                apis: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        consumeCodePOST: async (input) => {

                            if (originalImplementation.consumeCodePOST === undefined) {
                                throw Error("Should never come here");
                            }
                            
                            // First we call the original implementation of consumeCodePOST.
                            let response = await originalImplementation.consumeCodePOST(input);

                            // Post sign up response, we check if it was successful
                            if (response.status === "OK") {
                                let { id, email, phoneNumber } = response.user;
                                email = email!; // asserts not null
                                
                                if (response.createdNewUser) {
                                    // TODO: post sign up logic
                                    try {
                                        await createUser(id, email);
                                    } catch (e) {
                                        console.error(e);
                                    }
                                } else {
                                    try {
                                        const user = await fetchUser(id);
                                        console.log(user)
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }
                            }
                            return response;
                        }
                    }
                }
            }
        }),
        Session.init(),
        Dashboard.init({
            apiKey: 'abcd'
        }),
    ]
};
