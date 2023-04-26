import { readFileSync_w } from "../wrappers/readFileSync_w";
import { basename, resolve } from "path";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";
import type { Socket } from "socket.io";

export const reqFile = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
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
        should, but does not hear to check
    */
    if (!resolve(fullPath).startsWith(resolve(trajectoriesDiskPath_i))) return;

    // read file using wrapper function to catch errors
    const file = readFileSync_w(fullPath);

    socket.emit("resFile", {
        fileName: basename(reqFilePath),
        file: file,
    });
};
