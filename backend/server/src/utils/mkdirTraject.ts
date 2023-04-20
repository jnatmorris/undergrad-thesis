import { existsSync, mkdirSync } from "fs";
import { exit } from "process";

export const mkdirTraject = (path: string): string | null => {
    try {
        let i = 0;

        while (existsSync(`${path}_${i}`)) {
            i++;
        }

        const finalTrajectoryDirPath = `${path}_${i}`;

        mkdirSync(finalTrajectoryDirPath);

        return finalTrajectoryDirPath;
    } catch (error) {
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling mkdirSync\n\n",
            error
        );
        exit();
    }
};
