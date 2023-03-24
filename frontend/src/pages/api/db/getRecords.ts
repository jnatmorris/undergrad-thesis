import type { NextApiRequest, NextApiResponse } from "next";

const getRecords = async (req: NextApiRequest, res: NextApiResponse) => {
    // check if POST request
    if (req.method === "POST") {
        // get identity and password from body of request
        const { token } = req.body;

        // check if exist/empty
        if (token === null) {
            res.status(501).send({ error: "Not authorized" });
            return;
        }

        if (!process.env.GET_RECORDS_URL) {
            res.status(501).send({ error: "No provided URL in env file" });
            return;
        }

        // make request to authenticate
        const requestRes = await fetch(process.env.GET_RECORDS_URL, {
            headers: {
                Authorization: token,
            },
        });

        res.status(requestRes.status).json(await requestRes.json());
    } else {
        res.status(501).send({ error: "Not authorized" });
    }
};

export default getRecords;
