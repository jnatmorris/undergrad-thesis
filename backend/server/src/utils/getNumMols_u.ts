import { readFileSync_w } from "../wrappers/readFileSync_w";

export const getNumMols_u = (energyFilePath: string): number => {
    // get the number of molecules by reading the energy file. Convert to string as wrapper returns Buffer
    const readContent = readFileSync_w(energyFilePath).toString("utf-8");

    // the number of molecules in file will be the length minus 1 as a new line is always written after last
    const numMols = readContent.split("\n").length - 1;

    return numMols;
};
