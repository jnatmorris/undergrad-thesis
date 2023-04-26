import { mkdirSync } from "fs";
import { exit } from "process";

// wrapper function to handle errors when making a directory
export const mkdirSync_w = (path: string): void => {
    try {
        // run passed path for new directory
        mkdirSync(path);
    } catch (error) {
        // if error, log to console
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling mkdirSync\n\n",
            error
        );
        exit();
    }
};
