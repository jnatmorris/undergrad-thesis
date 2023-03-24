import React from "react";
import { authContext_t } from "@Login/index";

export const AuthContext = React.createContext<authContext_t>({
    authStorage: null,
    endSession: () => null,
    startSession: async () => {},
});
