import { Worker } from "worker_threads";
import { Server } from "socket.io";
import { config } from "dotenv";
import Decimal from "decimal.js";
import type {
    threadRes_t,
    threadDone_t,
    serverState_t,
    workerData_t,
    CToSEvents_t,
    SToCEvents_t,
    InSEvents_t,
    SocketData_t,
} from "./src/types/types";
import { getCleanInput_u } from "./src/utils/getCleanInput_u";
import { generatePaths_u } from "./src/utils/generatePaths_u";
import { calcNumThreads_u } from "./src/utils/calcNumThreads_u";
import { getNumMols_u } from "./src/utils/getNumMols_u";
import { getDiskTrajectories_u } from "./src/utils/getDiskTrajectories_u";
import { initializerServer_u } from "./src/utils/initializerServer_u";
import { reqFile } from "./src/handlers/fileReq_h";
import { reqTraject_h } from "./src/handlers/reqTraject_h";
import { consolePrinter_d } from "./src/debug/consolePrinter_d";
import { existsSync_w } from "./src/wrappers/existsSync_w";
import { writeFileSync_w } from "./src/wrappers/writeFileSync_w";
import { appendFileSync_w } from "./src/wrappers/appendFileSync_w";
import { rmSync_w } from "./src/wrappers/rmSync_w";
import { execSync_w } from "./src/wrappers/execSync_w";
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
} = initializerServer_u();

const io = new Server<CToSEvents_t, SToCEvents_t, InSEvents_t, SocketData_t>({
    cors: {
        origin: "*",
    },
    maxHttpBufferSize: maxFileSize_i,
});

// listen for new connections
io.on("connection", (socket) => {
    // announce connection if debug is set to true
    if (debug_i) {
        consolePrinter_d({ header: "C", message: socket.id });
    }

    // if a new user connects, let them know of current server state
    socket.emit("haveCurrentJob", JSON.stringify(serverState));

    // when a user requests trajectories, send everyone updated list
    socket.on("reqTrajectories", () =>
        reqTraject_h(io, trajectoriesDiskPath_i)
    );

    // listen for when users request file with a string
    socket.on("reqFile", (filePath: string) =>
        reqFile(socket, filePath, trajectoriesDiskPath_i)
    );

    // listen for if a user requests a new calculation
    socket.on(
        "newCalcReq",
        ({ trajectoryName, trajectory, orcaConfig, userReqThreads }) => {
            // ============================================
            // as soon as user enters, tell everyone that server is calculating
            serverState = {
                isServerCalc: true,
                serverNumMol: 0,
                serverProgress: 0,
            };
            io.emit("updatedServerState", JSON.stringify(serverState));

            // clean inputs sent from user
            const { trajectoryDirName_r, trajectory_r, configStr_r } =
                getCleanInput_u(trajectoryName, trajectory, orcaConfig);

            // generate paths
            const { trajectoryDirPath_r, energyPathTxt_r, logFileDir_r } =
                generatePaths_u(trajectoryDirName_r, trajectoriesDiskPath_i);

            // cap the user requested number of threads
            const numberThreads = calcNumThreads_u(
                trajectory_r.length,
                userReqThreads,
                maxNumThreads_i
            );

            // if debug is true, print to console request overview and config values
            if (debug_i) {
                consolePrinter_d(
                    { header: "N", message: "" },
                    {
                        "Trajectory name": `${trajectoryDirName_r}.xyz`,
                        "# requested threads": userReqThreads,
                        "exec. # threads": numberThreads,
                        "Total molecules": trajectory_r.length,
                        "----------------": "------------------------",
                        "Trajectory path": trajectoryDirPath_r,
                        "energies.txt path": energyPathTxt_r,
                        "logFiles path": logFileDir_r,
                    }
                );
            }

            // update users with new server state
            serverState = {
                isServerCalc: true,
                serverNumMol: trajectory_r.length,
                serverProgress: 0,
            };
            io.emit("updatedServerState", JSON.stringify(serverState));

            // set the start time for calculating
            const startTime = process.hrtime();

            // set the number of runs to the number of threads
            var numberOfRuns = numberThreads;

            // while still need to run, spawn new worker for a set of molecules
            while (numberOfRuns > 0) {
                // calculate the number of molecules to do in this run
                const numMolecules = Math.ceil(
                    trajectory_r.length / numberOfRuns
                );

                // spawn/create a new worker thread to take care of portion of trajectory
                const workerThread = new Worker("./src/worker/spawnWorker.ts", {
                    // pass the thread the required work
                    workerData: {
                        // Orca script path
                        orcaScriptDiskPath_i: orcaScriptDiskPath_i,
                        // array of molecules this thread is responsible for
                        threadMolecules: trajectory_r.splice(0, numMolecules),
                        // working folder shall be the trajectory's name name with number
                        trajectoryDirPath_r: trajectoryDirPath_r,
                        // config file string
                        configStr_r: configStr_r,
                    } as workerData_t,
                    // required to allow for using import statement
                    execArgv: ["--require", "ts-node/register"],
                });

                // listen to when the worker(s) messages parent
                workerThread.on(
                    "message",
                    (message: threadRes_t | threadDone_t) => {
                        switch (message.finished) {
                            case true:
                                // test if done computing all molecules by seeing if all are in energy file
                                if (
                                    getNumMols_u(energyPathTxt_r) ===
                                    serverState.serverNumMol
                                ) {
                                    // get the time since started calculating
                                    const endTime = process.hrtime(startTime);

                                    // create decimals for both seconds and nanoseconds
                                    const seconds = new Decimal(endTime[0]);
                                    const nanoseconds = new Decimal(endTime[1]);

                                    // Compute the amount of time which elapsed in seconds
                                    const elapsedTime = seconds
                                        .plus(nanoseconds.dividedBy(1e9))
                                        .toFixed(3);

                                    // Console log the elapsed time
                                    consolePrinter_d({
                                        header: "S",
                                        message: `Completed computation in ${elapsedTime}s`,
                                    });

                                    // update server state
                                    serverState = {
                                        isServerCalc: false,
                                        serverNumMol: 0,
                                        serverProgress: 0,
                                    };

                                    // tell all users new server state
                                    io.emit(
                                        "updatedServerState",
                                        JSON.stringify(serverState)
                                    );

                                    // zip the log files dir
                                    execSync_w(
                                        `cd ${trajectoryDirPath_r} && zip -r logFiles.zip logFiles`
                                    );

                                    // remove log files directory as already zipped
                                    rmSync_w(logFileDir_r, {
                                        recursive: true,
                                        force: true,
                                    });

                                    // get all trajectories to send to all listening users
                                    const trajectoriesObj =
                                        getDiskTrajectories_u(
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
                                // set server state to show progress
                                serverState = {
                                    isServerCalc: true,
                                    serverNumMol: serverState.serverNumMol,
                                    serverProgress:
                                        serverState.serverProgress + 1,
                                };

                                // send an update to all clients
                                io.emit(
                                    "updatedServerState",
                                    JSON.stringify(serverState)
                                );

                                // check if energy txt exists. If it does, then create a new, else append
                                if (!existsSync_w(energyPathTxt_r)) {
                                    writeFileSync_w(
                                        energyPathTxt_r,
                                        message.formattedStr
                                    );
                                } else {
                                    appendFileSync_w(
                                        energyPathTxt_r,
                                        message.formattedStr
                                    );
                                }
                                break;

                            // if get here, an error has occurred
                            default:
                                consolePrinter_d({
                                    header: "E",
                                    message: "Child message unknown",
                                });
                        }
                    }
                );

                // after a run, subtract the remaining to be run
                numberOfRuns--;
            }
        }
    );

    // listen for when a user disconnects
    socket.on("disconnect", () => {
        if (debug_i) {
            consolePrinter_d({ header: "D", message: socket.id });
        }
    });
});

// listen on port
io.listen(PORT_i);
