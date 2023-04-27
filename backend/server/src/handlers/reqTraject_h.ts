import { getDiskTrajectories_u } from "../utils/getDiskTrajectories_u";
import type { Server } from "socket.io";
import type {
    CToSEvents_t,
    SToCEvents_t,
    InSEvents_t,
    SocketData_t,
} from "../types/types";

export const reqTraject_h = (
    io: Server<CToSEvents_t, SToCEvents_t, InSEvents_t, SocketData_t>,
    storageDiskPath: string
) => {
    // get trajectories on disk
    const trajectoriesObj = getDiskTrajectories_u(storageDiskPath);

    // emit trajectories to all connected
    io.emit("resTrajectories", JSON.stringify(trajectoriesObj));
};
