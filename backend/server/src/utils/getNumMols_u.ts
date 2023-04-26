import { readFileSync_w } from "../wrappers/readFileSync_w";

export const getNumMols_u = (energyFilePath: string): number => {
    const readContent = readFileSync_w(energyFilePath);

    const numFilesInDir = readContent.split("\n").length - 1;

    return numFilesInDir;
};
