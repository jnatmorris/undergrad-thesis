import { execSync } from "child_process";
import { rmSync } from "fs";
import { exit } from "process";

// function to zip and remove the files that were zipped
export const zipAndDelete = (
    trajectoryDir: string,
    dirToRemove: string
): void => {
    // cd and zip orca output files
    try {
        const zipCommand = `cd ${trajectoryDir} && zip -r logFiles.zip logFiles`;
        execSync(zipCommand);
    } catch (error) {
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling execSync\n\n",
            error
        );
        exit();
    }

    // remove files in the path given by dirToZip
    try {
        rmSync(dirToRemove, { recursive: true, force: true });
    } catch (error) {
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling rmSync\n\n",
            error
        );
        exit();
    }
};
