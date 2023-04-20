import { Worker } from "worker_threads";
import { writeFileSync, existsSync, appendFileSync } from "fs";
import { getNumFilesDir } from "./src/utils/getNumFilesDir";
import { Server } from "socket.io";
import { config } from "dotenv";
import Decimal from "decimal.js";
import type {
    runOrca_t,
    threadRes_t,
    threadDone_t,
    serverState_t,
    workerData_t,
} from "./src/types/types";
import { zipAndDelete } from "./src/utils/zipAndDelete";
import { cleanInputs } from "./src/utils/cleanInput";
import { pathGenerator } from "./src/utils/pathGenerator";
import { numThreads } from "./src/utils/numThreads";
import { getTrajectories } from "./src/utils/getTrajectories";
import { serverInitializer } from "./src/utils/serverInitializer";
import { reqFile } from "./src/handlers/fileReq_h";
import { reqTraject_h } from "./src/handlers/reqTraject_h";
config(); // tell dotenv to check for env variables

var serverState: serverState_t = {
    isServerCalc: false,
    serverProgress: 0,
    serverNumMol: 0,
};

const {
    maxFileSize_i,
    maxNumThreads_i,
    debug_i,
    PORT_i,
    trajectoriesDiskPath_i,
    orcaScriptDiskPath_i,
} = serverInitializer();

const io = new Server({
    cors: {
        origin: "*",
    },
    maxHttpBufferSize: maxFileSize_i,
});

io.on("connection", (socket) => {
    // ========================================================
    // announce connection if debug is set to true
    if (debug_i) {
        console.log("\x1b[32m%s\x1b[0m%s", `Connection: `, socket.id);
    }

    // if a new user connects, let them know of current server state
    socket.emit("haveCurrentJob", JSON.stringify(serverState));

    // when a user requests trajectories, send everyone updated list of them
    socket.on("reqTrajectories", () =>
        reqTraject_h(io, trajectoriesDiskPath_i)
    );

    // listen for when users request file with a string
    socket.on("reqFile", (filePath: string) => reqFile(socket, filePath));

    // listen for if a user requests a new calculation
    socket.on(
        "newCalcReq",
        ({
            trajectoryName,
            trajectory,
            orcaConfig,
            userReqThreads,
        }: runOrca_t) => {
            // =========================================
            // as soon as user enters, tell everyone that server is calculating
            serverState = {
                isServerCalc: true,
                serverNumMol: 0,
                serverProgress: 0,
            };
            io.emit("willStartCal", JSON.stringify(serverState));

            // clean inputs sent from user
            const { trajectoryDirName_r, trajectory_r, configStr_r } =
                cleanInputs(trajectoryName, trajectory, orcaConfig);

            // generate paths
            const { trajectoryDirPath_r, energyPathTxt_r, logFileDir_r } =
                pathGenerator(trajectoryDirName_r, trajectoriesDiskPath_i);

            // cap the user requested number of threads
            const numberThreads = numThreads(
                trajectory_r.length,
                userReqThreads,
                maxNumThreads_i
            );

            // calculate the WPT (Work Per Thread)
            const WPT = new Decimal(trajectory_r.length)
                .div(numberThreads)
                .ceil()
                .toNumber();

            // if debug is true, print to console request overview and config values
            if (debug_i) {
                console.log("\x1b[33m%s\x1b[0m", "Notice:");

                // compute the amount of work
                const totalWork = new Decimal(WPT).mul(numberThreads);
                const remainder = new Decimal(totalWork).sub(
                    trajectory_r.length
                );

                console.table({
                    "Trajectory name": trajectoryDirName_r,
                    "# requested threads": userReqThreads,
                    "Total molecules": trajectory_r.length,
                    trajectory: "File",
                    orcaConfig: "File",
                    "----------------": "---------------------------",
                    "Trajectory path": trajectoryDirPath_r,
                    "Energy txt path": energyPathTxt_r,
                    "Log files path": logFileDir_r,
                    "---------------": "---------------------------",
                    "Requested threads": userReqThreads,
                    "Number of threads chosen": numberThreads,
                    "Work per thread": WPT,
                    "Total work": totalWork.toNumber(),
                    "Equal work per thread": remainder.equals(0) ? "yes" : "no",
                    // Remainder = (WPT * #threads) - #molecules
                    Remainder: remainder.toNumber(),
                });
            }

            // update users with new server state
            serverState = {
                isServerCalc: true,
                serverNumMol: trajectory_r.length,
                serverProgress: 0,
            };
            io.emit("willStartCal", JSON.stringify(serverState));

            for (let i = 0; i < trajectory_r.length; i += WPT) {
                // if the working set, is greater than the length of molecules, shorten to length
                const workSet = i + WPT;
                const trueWorkSet =
                    workSet > trajectory_r.length
                        ? trajectory_r.length
                        : workSet;

                // spawn/create a new worker thread to take care of portion of trajectory
                const workerThread = new Worker("./src/utils/worker.ts", {
                    // pass the thread the required work
                    workerData: {
                        // total number of molecules
                        totalNumMolecules: trajectory_r.length,
                        // Orca script path
                        orcaScriptDiskPath_i: orcaScriptDiskPath_i,
                        // start index of this thread
                        startIndex: i,
                        // array of molecules this thread is responsible for
                        threadMolecules: trajectory_r.slice(i, trueWorkSet),
                        // working folder shall be the trajectory's name (the name of the uploaded trajectory is the name of the directory working in (unless duplicate, then add number))
                        trajectoryDirPath_r: trajectoryDirPath_r,
                        // configFile string
                        configStr_r: configStr_r,
                    } as workerData_t,
                    // required to allow for using import statement
                    execArgv: ["--require", "ts-node/register"],
                });

                // listen to when the worker messages parent
                workerThread.on(
                    "message",
                    (message: threadRes_t | threadDone_t) => {
                        switch (message.finished) {
                            case true:
                                const { totalNumMolecules } = message;

                                // test if done computing all molecules
                                if (
                                    getNumFilesDir(energyPathTxt_r) ===
                                    totalNumMolecules
                                ) {
                                    serverState = {
                                        isServerCalc: false,
                                        serverNumMol: 0,
                                        serverProgress: 0,
                                    };

                                    io.emit(
                                        "sendProgress",
                                        JSON.stringify(serverState)
                                    );

                                    // zip folder containing all log files
                                    zipAndDelete(
                                        trajectoryDirPath_r,
                                        logFileDir_r
                                    );

                                    // get all trajectories to send to all listening users
                                    const trajectoriesObj = getTrajectories(
                                        trajectoriesDiskPath_i
                                    );

                                    // emit to all listening users new trajectories
                                    io.emit(
                                        "resTrajectories",
                                        JSON.stringify(trajectoriesObj)
                                    );
                                }
                                break;

                            case false:
                                // deconstruct object
                                const { formattedStr } = message;

                                // set new job
                                serverState = {
                                    isServerCalc: true,
                                    serverNumMol: serverState.serverNumMol,
                                    serverProgress:
                                        serverState.serverProgress + 1,
                                };

                                // send an update to all clients
                                io.emit(
                                    "sendProgress",
                                    JSON.stringify(serverState)
                                );

                                // check if energy txt exists. If it does, then create a new, else append
                                if (!existsSync(energyPathTxt_r)) {
                                    writeFileSync(
                                        energyPathTxt_r,
                                        formattedStr
                                    );
                                } else {
                                    appendFileSync(
                                        energyPathTxt_r,
                                        formattedStr
                                    );
                                }

                                break;

                            default:
                                console.log(
                                    "\x1b[31m%s\x1b[0m%s",
                                    `ERROR: `,
                                    "child message unknown"
                                );
                        }
                    }
                );
            }
        }
    );

    // listen for when a user disconnects
    socket.on("disconnect", () => {
        if (debug_i) {
            console.log("\x1b[31m%s\x1b[0m%s", `Disconnection: `, socket.id);
        }
    });
});

// listen on port
io.listen(PORT_i);
