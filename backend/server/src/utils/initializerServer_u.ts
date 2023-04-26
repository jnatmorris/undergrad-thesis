import type { serverInitializer_t } from "../types/types";
import { ConsolePrinter } from "../debug/ConsolePrinter";
import { existsSync_w } from "../wrappers/existsSync_w";
import { mkdirSync_w } from "../wrappers/mkdirSync_w";

export const initializerServer_u = (): serverInitializer_t => {
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
        ConsolePrinter({
            header: "E",
            message: "Missing or unable to read environment variables",
        });

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
    ConsolePrinter(
        {
            header: "S",
            message: "Found and loaded environment variables",
        },
        {
            "Max file size (bytes)": maxFileSize_i,
            "Max # of threads": maxNumThreads_i,
            "Debug mode": debug_i,
            "Listening Port": PORT_i,
            "Trajectory disk path": trajectoriesDiskPath_i,
            "Orca script disk path": orcaScriptDiskPath_i,
        }
    );

    // ================================================
    // make files directory

    if (!existsSync_w(trajectoriesDiskPath_i)) {
        mkdirSync_w(trajectoriesDiskPath_i);
    }
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