import { execSync } from "child_process";
import { exit } from "process";

// wrapper function to handle errors when executing a command
export const execSync_w = (command: string): string => {
    try {
        // run passed command
        const stdout = execSync(command, { encoding: "utf-8" });
        return stdout;
    } catch (error) {
        // if error, log to console
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling execSync\n\n",
            error
        );
        exit();
    }
};
