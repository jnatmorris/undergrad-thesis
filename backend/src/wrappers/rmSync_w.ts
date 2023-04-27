import { rmSync } from "fs";
import { exit } from "process";

// wrapper function to handle errors removing path or directory
export const rmSync_w = (
    pathToRemove: string,
    options?: { recursive: boolean; force: boolean }
): void => {
    try {
        // remove passed path
        rmSync(pathToRemove, { ...options });
    } catch (error) {
        // if error, log to console
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling rmSync\n\n",
            error
        );
        exit();
    }
};
