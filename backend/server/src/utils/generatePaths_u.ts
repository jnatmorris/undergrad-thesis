import { pathGenerator_t } from "../types/types";
import { existsSync_w } from "../wrappers/existsSync_w";
import { mkdirSync_w } from "../wrappers/mkdirSync_w";

export const generatePaths_u = (
    cleanName: string,
    trajectoriesDiskPath: string
): pathGenerator_t => {
    let i = 0;
    // while the path exists, add to 1 to i
    while (existsSync_w(`${trajectoriesDiskPath}/${cleanName}_${i}`)) {
        i++;
    }

    const trajectoryDirPath_r = `${trajectoriesDiskPath}/${cleanName}_${i}`;

    // when the ith path does not exists, make a directory from the path
    mkdirSync_w(trajectoryDirPath_r);

    // ========================================

    const energyPathTxt_r = `${trajectoryDirPath_r}/energies.txt`;
    const logFileDir_r = `${trajectoryDirPath_r}/logFiles`;

    if (!existsSync_w(logFileDir_r)) {
        mkdirSync_w(logFileDir_r);
    }

    return {
        trajectoryDirPath_r,
        energyPathTxt_r,
        logFileDir_r,
    };
};
