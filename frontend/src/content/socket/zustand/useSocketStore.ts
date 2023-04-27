import { create } from "zustand";
import type {
    socketStoreState_t,
    trajectoriesOnDiskBaseState_t,
    useSocketStoreActions_t,
    serverState_t,
} from "..";

export const useSocketStore = create<
    socketStoreState_t & useSocketStoreActions_t
>((set) => ({
    // initial data
    isSocketConnected: false,
    isWaitingOnDisk: false,
    trajectoriesOnDisk: [],
    serverState: {
        isServerCalc: false,
        serverProgress: 0,
        serverNumMol: 0,
    },

    // if connected to server
    setIsConnected: (connected: boolean) =>
        set(() => ({ isSocketConnected: connected })),

    // setter when waiting for server on disk
    setIsWaitingOnDisk: (waitingOnDisk: boolean) =>
        set(() => ({ isWaitingOnDisk: waitingOnDisk })),

    // setter when get trajectories
    setTrajectoriesOnDisk: (
        allTrajectoriesOnDisk: trajectoriesOnDiskBaseState_t[]
    ) => set(() => ({ trajectoriesOnDisk: allTrajectoriesOnDisk })),

    // setter when we get a new server state
    setServerState: (newServerState: serverState_t) =>
        set(() => ({
            serverState: {
                isServerCalc: newServerState.isServerCalc,
                serverNumMol: newServerState.serverNumMol,
                serverProgress: newServerState.serverProgress,
            },
        })),
}));
