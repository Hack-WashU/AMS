import PasswordlessReact from "supertokens-auth-react/recipe/passwordless";
import SessionReact from "supertokens-auth-react/recipe/session";
import Session from "supertokens-web-js/recipe/session";

export const SuperTokensReactConfig = {
  appInfo: {
    appName: "SuperTokens Demo App",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
  },
  recipeList: [
    PasswordlessReact.init({
      useShadowDom: false,
      contactMethod: "EMAIL_OR_PHONE",
    }),
    SessionReact.init(),
  ],
};

export const SuperTokensWebJSConfig = {
  appInfo: {
    appName: "SuperTokens Demo",
    apiDomain: "http://localhost:3001",
  },
  recipeList: [Session.init()],
};
