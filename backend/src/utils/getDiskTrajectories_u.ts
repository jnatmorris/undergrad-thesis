import type { getDiskTrajectories_t } from "../types/types";
import { getNumMols_u } from "./getNumMols_u";
import { readdirSync_w } from "../wrappers/readdirSync_w";
import { statSync_w } from "../wrappers/statSync_w";
import { existsSync_w } from "../wrappers/existsSync_w";

export const getDiskTrajectories_u = (
    storageDiskPath: string
): getDiskTrajectories_t[] => {
    // read directory of trajectories
    const trajectoriesAndData = readdirSync_w(storageDiskPath, {
        withFileTypes: false,
    }).map((trajectoryDirName) => {
        // format path for single molecule's directory
        const moleculeDirPath = `${storageDiskPath}/${trajectoryDirName}`;

        // get which files inside of molecule directory
        const filesInside = readdirSync_w(moleculeDirPath);

        // format path for energy within directory
        const energiesPath = `${storageDiskPath}/${trajectoryDirName}/energies.txt`;

        // if the energies path exists, then get data and return
        if (existsSync_w(energiesPath)) {
            // get the number of molecules
            const numMolecule = getNumMols_u(energiesPath);

            // get the time of file creation
            const { birthtime } = statSync_w(energiesPath);

            return {
                trajectoryDirName,
                numMolecule,
                filesInside,
                uploadDate: birthtime.toISOString(),
            };
        }
    });

    /* 
        Filter out all values which are undefined. Energy files will be undefined when the trajectory is being computed
        but no molecules have finished being calculated. This is a corner case which can cause a crash. Able to cast 
        without worry as filter out undefined values. 
    */
    const validTrajectories = trajectoriesAndData.filter(
        (x) => x !== undefined
    ) as getDiskTrajectories_t[];

    // return valid trajectories
    return validTrajectories;
};
