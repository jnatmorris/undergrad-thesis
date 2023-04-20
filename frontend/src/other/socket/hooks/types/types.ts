// ============================================================
// types for useSocket hook

export interface trajectoriesOnDiskBase_t {
    moleculeName: string;
    filesInside: string[];
    numMolecule: number;
    partialPath: string;
}

export interface trajectoriesOnDiskBaseEmit_t extends trajectoriesOnDiskBase_t {
    uploadDate: string;
}

export interface trajectoriesOnDiskBaseState_t
    extends trajectoriesOnDiskBase_t {
    uploadDate: Date;
}

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
