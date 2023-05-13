import type { generatePaths_t } from "../types/types";
import { existsSync_w } from "../wrappers/existsSync_w";
import { mkdirSync_w } from "../wrappers/mkdirSync_w";

export const generatePaths_u = (
    cleanName: string,
    storageDiskPath: string
): generatePaths_t => {
    // start i at 0
    let i = 0;

    // while the path exists, add to 1 to i
    while (existsSync_w(`${storageDiskPath}/${cleanName}_${i}`)) {
        i++;
    }

    // when the ith path does not exists, make a directory from the path
    const trajectoryDirPath_r = `${storageDiskPath}/${cleanName}_${i}`;
    mkdirSync_w(trajectoryDirPath_r);

    // formulate paths for the energy file and the log file
    const energyPathTxt_r = `${trajectoryDirPath_r}/energies.txt`;
    const logFileDir_r = `${trajectoryDirPath_r}/logFiles`;

    // if the log file directory does not exist, then make it
    if (!existsSync_w(logFileDir_r)) {
        mkdirSync_w(logFileDir_r);
    }

    return {
        trajectoryDirPath_r,
        energyPathTxt_r,
        logFileDir_r,
    };
};
