import { existsSync } from "fs";
import { exit } from "process";

// wrapper function to handle errors when checking if path exists
export const existsSync_w = (path: string): boolean => {
    try {
        // check if path exists
        const doesExists = existsSync(path);
        return doesExists;
    } catch (error) {
        // if error, log to console
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling existsSync\n\n",
            error
        );
        exit();
    }
};
