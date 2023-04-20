import { readFileSync } from "fs";
import { exit } from "process";

export const getNumFilesDir = (energyFilePath: string): number => {
    try {
        const numFilesInDir =
            readFileSync(energyFilePath, "utf-8").split("\n").length - 1;
        return numFilesInDir;
    } catch (error) {
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling readFileSync\n\n",
            error
        );
        exit();
    }
};
