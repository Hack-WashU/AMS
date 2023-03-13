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

                                if (response.createdNewUser) {
                                    // TODO: post sign up logic
                                    console.log("New user created: ", id, email, phoneNumber)
                                    // run prisma script --> extract to new file?
                                } else {
                                    // TODO: post sign in logic
                                    console.log("User signed in: ", id, email, phoneNumber)
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
