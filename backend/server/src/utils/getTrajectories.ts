import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { getTrajectories_t } from "../types/types";
import { exit } from "process";

export const getTrajectories = (
    trajectoriesDiskPath: string
): getTrajectories_t[] => {
    try {
        // read directory
        const trajectoriesAndData = readdirSync(trajectoriesDiskPath, {
            withFileTypes: false,
        }).map((trajectoryName) => {
            // get the name of the trajectories
            const trajectoryNameStr = trajectoryName.toString("utf-8");
            const moleculeFolderPath = `${trajectoriesDiskPath}/${trajectoryNameStr}`;

            // test what files inside of the molecule folder
            const filesInside = readdirSync(moleculeFolderPath);

            const filePath = `${trajectoriesDiskPath}/${trajectoryName}/energies.txt`;

            if (existsSync(filePath)) {
                // get the number of molecules
                const numMolecule =
                    readFileSync(filePath, "utf-8").split("\n").length - 1;

                // get the time of file creation
                const { birthtime } = statSync(filePath);

                return {
                    moleculeName: trajectoryNameStr,
                    filesInside,
                    numMolecule,
                    uploadDate: birthtime.toISOString(),
                    partialPath: moleculeFolderPath,
                };
            }
        });

        const trajectoriesValid = trajectoriesAndData.filter(
            (x) => x !== undefined
        ) as getTrajectories_t[];

        return trajectoriesValid;
    } catch (error) {
        console.log(
            "\x1b[31m%s\x1b[0m%s%s",
            "ERROR: ",
            "error calling multiple system functions in getTrajectories\n\n",
            error
        );
        exit();
    }
};
