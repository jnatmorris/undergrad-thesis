import { getDiskTrajectories_u } from "../utils/getDiskTrajectories_u";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";
import type { Server } from "socket.io";

export const reqTraject_h = (
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    trajectoriesDiskPath: string
) => {
    const trajectoriesObj = getDiskTrajectories_u(trajectoriesDiskPath);
    io.emit("resTrajectories", JSON.stringify(trajectoriesObj));
};
