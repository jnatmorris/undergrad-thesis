import { useSocket } from "./hooks/useSocket";
import { useSocketStore } from "./zustand/useSocketStore";
export { useSocket, useSocketStore };

import type {
    trajectoriesOnDiskBase_t,
    trajectoriesOnDiskBaseState_t,
    socketStoreState_t,
    useSocketStoreActions_t,
    serverState_t,
} from "./zustand/types/types";

import type {
    resFile_t,
    trajectoriesOnDiskBaseEmit_t,
} from "./hooks/types/types";

export type {
    trajectoriesOnDiskBase_t,
    trajectoriesOnDiskBaseEmit_t,
    resFile_t,
    trajectoriesOnDiskBaseState_t,
    socketStoreState_t,
    useSocketStoreActions_t,
    serverState_t,
};
