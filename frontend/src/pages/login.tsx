import { NextPage } from "next";
import React from "react";
import { AuthContext } from "@Login/index";

const Login: NextPage = () => {
    const [identity, setIdentity] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [viewPassword, setViewPassword] = React.useState<boolean>(false);
    const { startSession } = React.useContext(AuthContext);

    return (
        <div>
            <form>
                <label htmlFor="identity">Username or Email</label>
                <input
                    name="identity"
                    placeholder="John / John@Doe.com"
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    tabIndex={1}
                />
                <label htmlFor="password"></label>
                <input
                    name="password"
                    placeholder="********"
                    value={password}
                    type={viewPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    tabIndex={2}
                />
                <button
                    onClick={() => startSession(identity, password)}
                    type="button"
                    tabIndex={3}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
