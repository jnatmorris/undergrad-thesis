import { renameSync } from "fs";
import { exit } from "process";

// wrapper function to handle the renaming
export const renameSync_w = (oldPath: string, newPath: string): void => {
    try {
        // rename old path to new path
        renameSync(oldPath, newPath);
    } catch (error) {
        // if error, log to console
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling readdirSync\n\n",
            error
        );
        exit();
    }
};
