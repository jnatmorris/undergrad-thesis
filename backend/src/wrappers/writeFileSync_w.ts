import { writeFileSync } from "fs";
import { exit } from "process";

// wrapper function to handle errors when attempting to write to a file
export const writeFileSync_w = (path: string, data: string): void => {
    try {
        // write data to the path supplied
        writeFileSync(path, data);
    } catch (error) {
        // if error, log to console
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling writeFileSync\n\n",
            error
        );
        exit();
    }
};
