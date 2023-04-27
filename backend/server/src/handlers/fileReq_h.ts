import { readFileSync_w } from "../wrappers/readFileSync_w";
import { basename, resolve } from "path";
import type {
    CToSEvents_t,
    SToCEvents_t,
    InSEvents_t,
    SocketData_t,
} from "../types/types";
import type { Socket } from "socket.io";

export const reqFile = (
    socket: Socket<CToSEvents_t, SToCEvents_t, InSEvents_t, SocketData_t>,
    reqFilePath: string,
    trajectoriesDiskPath_i: string
) => {
    /* 
        As don't want to allow user to generate path themselves client-side, 
        combine user passed request (trajectoryName/fileName) with the
        path specified as the directory to all trajectories on disk. 
    */
    const fullPath = `${trajectoriesDiskPath_i}/${reqFilePath}`;

    /* 
        Double check and ensure that the path created resolves in the path 
        specified as directory to all trajectories. Theoretically always
        should, but does not hurt to check.
    */
    if (!resolve(fullPath).startsWith(resolve(trajectoriesDiskPath_i))) return;

    // read file using wrapper function to catch errors
    const readFile = readFileSync_w(fullPath);

    // emit to socket the file and filename
    socket.emit("resFile", {
        fileName: basename(reqFilePath),
        file: readFile,
    });
};
