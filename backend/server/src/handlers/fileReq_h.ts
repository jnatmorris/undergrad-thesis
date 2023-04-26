import { readFileSync_w } from "../wrappers/readFileSync_w";
import path from "path";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";
import type { Socket } from "socket.io";

export const reqFile = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    filePath: string
) => {
    // read file using wrapper function to catch errors
    const file = readFileSync_w(filePath);

    socket.emit("resFile", {
        fileName: path.basename(filePath),
        file: file,
    });
};
