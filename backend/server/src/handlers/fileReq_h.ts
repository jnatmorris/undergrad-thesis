import { readFileSync } from "fs";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";
import type { Socket } from "socket.io";
import path from "path";

export const reqFile = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    filePath: string
) => {
    const file = readFileSync(filePath);
    socket.emit("resFile", {
        fileName: path.basename(filePath),
        file: file,
    });
};
