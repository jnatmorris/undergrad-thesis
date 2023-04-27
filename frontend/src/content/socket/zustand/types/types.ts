// ============================================================
// types for zustand store

export interface serverState_t {
    isServerCalc: boolean;
    serverProgress: number;
    serverNumMol: number;
}

export interface socketStoreState_t {
    isSocketConnected: boolean | null;
    isWaitingOnDisk: boolean;
    trajectoriesOnDisk: trajectoriesOnDiskBaseState_t[];
    serverState: serverState_t;
}

export interface useSocketStoreActions_t {
    setIsConnected: (connected: boolean) => void;
    setIsWaitingOnDisk: (waitingOnDisk: boolean) => void;
    setTrajectoriesOnDisk: (
        allTrajectoriesOnDisk: trajectoriesOnDiskBaseState_t[]
    ) => void;
    setServerState: (newServerState: serverState_t) => void;
}

export interface trajectoriesOnDiskBase_t {
    trajectoryDirName: string;
    filesInside: string[];
    numMolecule: number;
}

export interface trajectoriesOnDiskBaseState_t
    extends trajectoriesOnDiskBase_t {
    uploadDate: Date;
}
