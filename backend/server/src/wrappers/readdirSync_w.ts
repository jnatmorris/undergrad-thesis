import { readdirSync } from "fs";
import { exit } from "process";

// wrapper function to handle errors when reading from a directory
export const readdirSync_w = (
    dirPath: string,
    options?: { withFileTypes: false }
): string[] => {
    try {
        // get contents from directory
        const contents = readdirSync(dirPath, {
            ...options,
            encoding: "utf-8",
        });
        return contents;
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
