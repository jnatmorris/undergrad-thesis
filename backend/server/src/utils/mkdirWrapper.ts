import { mkdirSync } from "fs";
import { exit } from "process";

export const mkdirWrapper = (path: string): void => {
    try {
        mkdirSync(path);
    } catch (error) {
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling mkdirSync\n\n",
            error
        );
        exit();
    }
};
