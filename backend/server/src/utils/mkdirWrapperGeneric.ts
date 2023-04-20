import { existsSync, mkdirSync } from "fs";
import { exit } from "process";

export const mkdirWrapperGeneric = (path: string): void => {
    try {
        // if the path does not exist, make dir
        if (!existsSync(path)) {
            mkdirSync(path);
        }
    } catch (error) {
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            `error calling mkdirSync in mkdirWrapperGeneric with path: ${path} \n\n`,
            error
        );
        exit();
    }
};
