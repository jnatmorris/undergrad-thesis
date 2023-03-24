import type { envCheck_t } from "../types/types";

export const envCheck = (): envCheck_t => {
    // check if all env variables are set. If one is not, exit
    if (
        !process.env.maxFileSize ||
        !process.env.maxNumThreads ||
        !process.env.debug ||
        !process.env.PORT
    ) {
        console.log(
            "\x1b[31m%s\x1b[0m",
            "Missing or unable to read environment variables"
        );

        // exit
        process.exit(1);
    }

    // configs
    const maxFileSize = process.env.maxFileSize
        ? Number(process.env.maxFileSize)
        : 10485760; // user specified or 10mb
    const maxNumThreads = process.env.maxNumThreads
        ? Number(process.env.maxNumThreads)
        : 12;
    const debug =
        process.env.debug && process.env.debug === "true" ? true : false;
    const PORT = process.env.PORT ? Number(process.env.PORT) : 3002; // 1 is true, 0 is false

    console.log(
        "\n\x1b[32m%s\x1b[0m%s",
        `Success:`,
        " Found environment variables"
    );

    console.table({
        maxFileSize: process.env.maxFileSize,
        maxNumThreads: process.env.maxNumThreads,
        debug: process.env.debug,
        PORT: process.env.PORT,
    });

    console.log("\n");

    return { maxFileSize, maxNumThreads, debug, PORT };
};
