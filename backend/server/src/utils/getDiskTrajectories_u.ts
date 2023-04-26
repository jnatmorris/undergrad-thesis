import { getTrajectories_t } from "../types/types";
import { getNumMols_u } from "./getNumMols_u";
import { readdirSync_w } from "../wrappers/readdirSync_w";
import { statSync_w } from "../wrappers/statSync_w";
import { existsSync_w } from "../wrappers/existsSync_w";

export const getDiskTrajectories_u = (
    trajectoriesDiskPath: string
): getTrajectories_t[] => {
    // read directory
    const trajectoriesAndData = readdirSync_w(trajectoriesDiskPath, {
        withFileTypes: false,
    }).map((trajectoryNameStr) => {
        // get the name of the trajectories
        const moleculeFolderPath = `${trajectoriesDiskPath}/${trajectoryNameStr}`;

        // test what files inside of the molecule folder
        const filesInside = readdirSync_w(moleculeFolderPath);

        const filePath = `${trajectoriesDiskPath}/${trajectoryNameStr}/energies.txt`;

        if (existsSync_w(filePath)) {
            // get the number of molecules
            const numMolecule = getNumMols_u(filePath);

            // get the time of file creation
            const { birthtime } = statSync_w(filePath);

            return {
                moleculeName: trajectoryNameStr,
                filesInside,
                numMolecule,
                uploadDate: birthtime.toISOString(),
                trajectoryName: trajectoryNameStr,
            };
        }
    });

    const trajectoriesValid = trajectoriesAndData.filter(
        (x) => x !== undefined
    ) as getTrajectories_t[];

    return trajectoriesValid;
};
