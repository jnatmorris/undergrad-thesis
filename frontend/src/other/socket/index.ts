import { useSocket } from "./hooks/useSocket";
import { useSocketStore } from "./Zustand/useSocketStore";
export { useSocket, useSocketStore };

import type {
    trajectoriesOnDiskBase_t,
    trajectoriesOnDiskBaseEmit_t,
    trajectoriesOnDiskBaseState_t,
    socketStoreState_t,
    useSocketStoreActions_t,
    serverState_t,
} from "./hooks/types/types";

export type {
    trajectoriesOnDiskBase_t,
    trajectoriesOnDiskBaseEmit_t,
    trajectoriesOnDiskBaseState_t,
    socketStoreState_t,
    useSocketStoreActions_t,
    serverState_t,
};
