// ===========================================
// ConsolePrinter types for messageInfo and object in table

export interface messageInfo_t {
    header: "S" | "N" | "E" | "C" | "D";
    message: string;
}

export interface tableObj_t {
    [key: string]: any;
}

// ===========================================
// types for response from worker threads

export interface threadRes_t {
    finished: false;
    moleculeNumber: number;
    formattedStr: string;
}

export interface threadDone_t {
    finished: true;
    threadNum: number;
    timeElapsed: string;
    totalNumMolecules: number;
}

// ===========================================
// type passed to worker thread

export interface workerData_t {
    totalNumMolecules: number;
    orcaScriptDiskPath_i: string;
    startIndex: number;
    threadMolecules: string[];
    trajectoryDirPath_r: string;
    configStr_r: string;
}

// ===========================================
// type for server state
export interface serverState_t {
    isServerCalc: boolean;
    serverProgress: number;
    serverNumMol: number;
}

// ===========================================
// return types for utility functions

export interface initializerServer_t {
    maxFileSize_i: number;
    maxNumThreads_i: number;
    debug_i: boolean;
    PORT_i: number;
    trajectoriesDiskPath_i: string;
    orcaScriptDiskPath_i: string;
}

export interface getCleanInput_t {
    trajectoryDirName_r: string;
    trajectory_r: string[];
    configStr_r: string;
}

export interface generatePaths_t {
    trajectoryDirPath_r: string;
    energyPathTxt_r: string;
    logFileDir_r: string;
}

export interface getDiskTrajectories_t {
    trajectoryDirName: string;
    filesInside: string[];
    numMolecule: number;
    uploadDate: string;
}

// ===========================================
// socket server types

export interface SToCEvents_t {
    haveCurrentJob: (serverState: string) => void;
    resTrajectories: (trajectories: string) => void;
    willStartCal: (serverState: string) => void;
    sendProgress: (serverState: string) => void;
    resFile: ({ fileName, file }: { fileName: string; file: Buffer }) => void;
}

export interface CToSEvents_t {
    reqTrajectories: () => void;
    reqFile: (filePath: string) => void;
    newCalcReq: (obj: {
        trajectoryName: string;
        trajectory: Buffer;
        orcaConfig: Buffer;
        userReqThreads: number;
    }) => void;
}

export interface InSEvents_t {}

export interface SocketData_t {}
