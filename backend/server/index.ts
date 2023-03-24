import { Worker } from "worker_threads";
import { writeFileSync, existsSync, appendFileSync } from "fs";
import { Server } from "socket.io";
import { config } from "dotenv";
import Decimal from "decimal.js";
import type { runOrca_t, threadRes_t } from "./src/types/types";
import { envCheck } from "./src/utils/envCheck";
import { cleanInputs } from "./src/utils/cleanInput";
import { mkdirWrapper } from "./src/utils/mkdirWrapper";
import { pathGenerator } from "./src/utils/pathGenerator";
import { numThreads } from "./src/utils/numThreads";
config(); // tell dotenv to check for env variables

const { maxFileSize, maxNumThreads, debug, PORT } = envCheck();

const io = new Server({
    cors: {
        origin: "*",
    },
    maxHttpBufferSize: maxFileSize,
});

io.on("connection", (socket) => {
    if (debug) {
        console.log("\x1b[32m%s\x1b[0m%s", `Connection: `, socket.id);
    }

    socket.on(
        "fileData",
        ({
            trajectoryName,
            trajectory,
            orcaConfig,
            userReqThreads,
        }: runOrca_t) => {
            const { cleanName, cleanTrajectory } = cleanInputs(
                trajectoryName,
                trajectory
            );

            const { trajectoryDir, energyTxt, logFileDir } =
                pathGenerator(cleanName);

            mkdirWrapper(trajectoryDir);
            mkdirWrapper(logFileDir);

            // cap the user requested number of threads
            const numberThreads = numThreads(
                cleanTrajectory.length,
                userReqThreads,
                maxNumThreads
            );

            // calculate the WPT (Work Per Thread)
            const WPT = new Decimal(cleanTrajectory.length)
                .div(numberThreads)
                .ceil()
                .toNumber();

            if (debug) {
                console.log("\x1b[33m%s\x1b[0m", "Notice:");

                const totalWork = new Decimal(WPT).mul(numberThreads);
                const remainder = new Decimal(totalWork).sub(
                    cleanTrajectory.length
                );

                const equalWork = remainder.equals(0) ? "yes" : "no";

                console.table({
                    "Trajectory name": cleanName,
                    "# requested threads": userReqThreads,
                    "Total molecules": cleanTrajectory.length,
                    trajectory: "File",
                    orcaConfig: "File",
                    "----------------": "---------------------------",
                    trajectoryDir,
                    energyTxt,
                    logFileDir,
                    "---------------": "---------------------------",
                    "Requested threads": userReqThreads,
                    "Number of threads chosen": numberThreads,
                    "Work per thread": WPT,
                    "Total work": totalWork.toNumber(),
                    "Equal work per thread": equalWork,
                    // Remainder = (WPT * #threads) - #molecules
                    Remainder: remainder.toNumber(),
                });
            }

            for (let i = 0; i < cleanTrajectory.length; i += WPT) {
                // if the working set, is greater than the length of molecules, shorten to length
                const workSet = i + WPT;
                const trueWorkSet =
                    workSet > cleanTrajectory.length
                        ? cleanTrajectory.length
                        : workSet;

                if (debug) {
                    console.log("\x1b[33m%s\x1b[0m", "Notice:");
                    console.table({
                        "start index": i,
                        "end index": trueWorkSet,
                        "Not WPT": i + WPT !== trueWorkSet ? true : false,
                        // "# fewer than WPT": ,
                    });
                }

                const workerThread = new Worker("./src/utils/worker.ts", {
                    // pass the thread the required work
                    workerData: {
                        folderName: cleanName,
                        startIndex: i,
                        molecules: cleanTrajectory.slice(i, trueWorkSet),
                    },
                    // required to allow for using import statement
                    execArgv: ["--require", "ts-node/register"],
                });

                workerThread.on(
                    "message",
                    ({ moleculeNumber, formattedStr }: threadRes_t) => {
                        socket.emit("sendProgress", moleculeNumber);

                        if (!existsSync(energyTxt)) {
                            writeFileSync(energyTxt, formattedStr);
                        } else {
                            appendFileSync(energyTxt, formattedStr);
                        }
                    }
                );
            }
        }
    );

    socket.on("disconnect", () => {
        if (debug) {
            console.log("\x1b[31m%s\x1b[0m%s", `Disconnection: `, socket.id);
        }
    });
});

io.listen(PORT);
