import type { Stats } from "fs";
import { statSync } from "fs";
import { exit } from "process";

// wrapper function to handle errors when getting stats from path
export const statSync_w = (path: string): Stats => {
    try {
        // get stats from path
        const readContent = statSync(path);
        return readContent;
    } catch (error) {
        // if error, log to console
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling statSync\n\n",
            error
        );
        exit();
    }
};
