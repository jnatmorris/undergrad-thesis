import type { serverInitializer_t } from "../types/types";
import { mkdirWrapperGeneric } from "./mkdirWrapperGeneric";

export const serverInitializer = (): serverInitializer_t => {
    // ================================================
    // check env file and create variables

    // check if all env variables are set. If one is not, exit
    if (
        !process.env.maxFileSize ||
        !process.env.maxNumThreads ||
        !process.env.debug ||
        !process.env.PORT ||
        !process.env.trajectoriesDiskPath ||
        !process.env.orcaScriptDiskPath
    ) {
        console.log(
            "\x1b[31m%s\x1b[0m",
            "Missing or unable to read environment variables"
        );

        // exit
        process.exit(1);
    }

    // get config values
    const maxFileSize_i = Number(process.env.maxFileSize);
    const maxNumThreads_i = Number(process.env.maxNumThreads);
    const debug_i =
        process.env.debug && process.env.debug === "true" ? true : false;
    const PORT_i = Number(process.env.PORT);
    const trajectoriesDiskPath_i = process.env.trajectoriesDiskPath;
    const orcaScriptDiskPath_i = process.env.orcaScriptDiskPath;

    // ================================================
    // print to the console for the user
    console.log(
        "\n\x1b[32m%s\x1b[0m%s",
        `Success:`,
        " Found environment variables"
    );

    console.table({
        "Max file size (bytes)": maxFileSize_i,
        "Max # of threads": maxNumThreads_i,
        "Debug mode": debug_i,
        "Listening Port": PORT_i,
        "Trajectory disk path": trajectoriesDiskPath_i,
        "Orca script disk path": orcaScriptDiskPath_i,
    });

    console.log("\n");
    // ================================================
    // make files directory

    mkdirWrapperGeneric(trajectoriesDiskPath_i);

    // ================================================

    return {
        maxFileSize_i,
        maxNumThreads_i,
        debug_i,
        PORT_i,
        trajectoriesDiskPath_i,
        orcaScriptDiskPath_i,
    };
};
