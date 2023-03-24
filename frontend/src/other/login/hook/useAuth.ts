import React from "react";
import type { authContext_t, auth200_t, login400_t } from "@Login/index";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { Cookies } from "react-cookie";

// custom hook to deal with authentication
export const useAuth = (): authContext_t => {
    const [authStorage, setAuthStorage] = React.useState<auth200_t | null>(
        null
    );
    const router = useRouter();
    const cookies = React.useMemo(() => new Cookies(), []);

    React.useEffect(() => {
        const cookie = cookies.get("pb_auth") as auth200_t;
        setAuthStorage(cookie);
    }, [cookies]);

    const endSession = (): void => {
        // remove cookie
        cookies.remove("pb_auth");
        setAuthStorage(null);
        toast.success("Successfully logged out", { id: "goodLogout" });
        router.push("/login");
    };

    // when logging in, make request to API route and set states
    const startSession = async (
        identity: string,
        password: string
    ): Promise<void> => {
        const loginPromise = new Promise<string>(async (resolve, reject) => {
            const loginRequest = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identity: identity,
                    password: password,
                }),
            });

            switch (loginRequest.status) {
                case 200:
                    const newAuthStorage =
                        (await loginRequest.json()) as auth200_t;

                    cookies.set("pb_auth", JSON.stringify(newAuthStorage));

                    router.push("/");
                    resolve("Successfully logged in");
                    break;

                case 400:
                    reject("Invalid credentials given");
                    break;

                case 501:
                    reject("An exception on the server occurred");
                    break;

                default:
                    reject("An exception has occurred");
                    break;
            }
        });

        toast.promise(
            loginPromise,
            {
                success: (msg: string) => msg,
                loading: "Logging in...",
                error: (msg: string) => msg,
            },
            { id: "loggingIn" }
        );
    };

    return { startSession, endSession, authStorage };
};
