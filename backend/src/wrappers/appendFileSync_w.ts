import { appendFileSync } from "fs";
import { exit } from "process";

// wrapper function to handle errors when attempting to append to a file
export const appendFileSync_w = (path: string, data: string): void => {
    try {
        // append data to the path supplied
        appendFileSync(path, data);
    } catch (error) {
        // if error, log to console
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling appendFileSync\n\n",
            error
        );
        exit();
    }
};
