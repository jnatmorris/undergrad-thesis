import { readFileSync } from "fs";
import { exit } from "process";

// wrapper function to handle errors when reading from a file
export const readFileSync_w = (path: string): string => {
    try {
        // read file from path
        const readContent = readFileSync(path, "utf-8");
        return readContent;
    } catch (error) {
        // if error, log to console
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling readFileSync\n\n",
            error
        );
        exit();
    }
};
