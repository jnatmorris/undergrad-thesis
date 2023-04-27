import { getCleanInput_t } from "../types/types";

export const getCleanInput_u = (
    trajectoryName: string,
    trajectoryFile: Buffer,
    orcaConfig: Buffer
): getCleanInput_t => {
    // clean up trajectory and put back together
    const trajectory_r = trajectoryFile
        .toString("utf-8")
        .trim()
        .split(/\n(?=\d+\n)/)
        .map((val) =>
            val
                .split("\n")
                .map((elem) => elem.trim())
                .join("\n")
        );

    // convert the config file to a string from buffer, remove all blank lines at end of string and split into array at new line
    const configStrArr = orcaConfig
        .toString("utf-8")
        .replace(/\n+$/, "")
        .split("\n");

    /*
        if user uploads containing last line, remove. As last line contains file wanting to run through Orca,
        this is set server side. Hence remove now, and add proper file name and path later.

        !ZINDO/S Conv Hueckel VeryTightSCF SlowConv DIIS NoMOPrint MiniPrint
        %rel SOCType 1 end

        %method FrozenCore fc_none end
        %cis NRoots 1
            MaxDim 100
            EWin -0.00001,0.00001
        end

        * xyzfile 0 1 benzene_0000.xyz
    */
    if (configStrArr[configStrArr.length - 1].startsWith("*")) {
        configStrArr.pop();
    }

    // join config array back together. Same as prior but without the last line
    const configStr_r = configStrArr.join("\n");

    return {
        /* 
            remove the .xyz when making the directory name as it comes from the 
            uploaded trajectory file's name which has .xyz
        */
        trajectoryDirName_r: trajectoryName.replace(".xyz", ""),
        trajectory_r,
        configStr_r,
    };
};
