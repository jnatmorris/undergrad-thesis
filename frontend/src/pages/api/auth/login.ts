import type { NextApiRequest, NextApiResponse } from "next";

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    // check if POST request
    if (req.method === "POST") {
        // get identity and password from body of request
        const { identity, password } = req.body;

        // check if exist/empty
        if (identity === null || password === null) {
            res.status(501).send({ error: "Not authorized" });
            console.log("test");
            return;
        }

        // make request to authenticate
        const requestRes = await fetch(
            "http://127.0.0.1:8090/api/collections/users/auth-with-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identity: identity,
                    password: password,
                }),
            }
        );

        const statusCode = requestRes.status;

        res.status(statusCode).json(await requestRes.json());
    } else {
        res.status(501).send({ error: "Not authorized" });
    }
};

export default loginHandler;
