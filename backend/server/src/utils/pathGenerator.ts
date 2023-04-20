import { pathGenerator_t } from "../types/types";
import { mkdirTraject } from "./mkdirTraject";
import { mkdirWrapperGeneric } from "./mkdirWrapperGeneric";

export const pathGenerator = (
    cleanName: string,
    trajectoriesDiskPath: string
): pathGenerator_t => {
    console.log("run");
    // format paths
    const initTrajectoryDir = `${trajectoriesDiskPath}/${cleanName}`;

    // make directories for trajectory and log files
    // mkdirWrapperGeneric(trajectoryDir);

    const trajectoryDirPath_r =
        mkdirTraject(initTrajectoryDir) ?? initTrajectoryDir;

    const energyPathTxt_r = `${trajectoryDirPath_r}/energies.txt`;
    const logFileDir_r = `${trajectoryDirPath_r}/logFiles`;
    mkdirWrapperGeneric(logFileDir_r);

    console.table({
        test: trajectoryDirPath_r,
        logFileDir_r,
    });

    return {
        trajectoryDirPath_r,
        energyPathTxt_r,
        logFileDir_r,
    };
};
