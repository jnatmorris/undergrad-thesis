export interface runOrca_t {
    trajectoryName: string;
    trajectory: Buffer;
    orcaConfig: Buffer;
    userReqThreads: number;
}

export interface threadDone_t {
    finished: true;
    threadNum: number;
    timeElapsed: string;
    totalNumMolecules: number;
}

export interface messageInfo_t {
    header: "S" | "N" | "E" | "C" | "D";
    message: string;
}

export interface obj_t {
    [key: string]: any;
}

export interface threadRes_t {
    finished: false;
    moleculeNumber: number;
    formattedStr: string;
}

export interface serverState_t {
    isServerCalc: boolean;
    serverProgress: number;
    serverNumMol: number;
}

export interface workerData_t {
    orcaScriptDiskPath_i: string;
    threadNum: number;
    trajectoryDirPath_r: string;
    startIndex: number;
    endIndex: number;
    totalNumMolecules: number;
    threadMolecules: string[];
    configStr_r: string;
}

export interface serverInitializer_t {
    maxFileSize_i: number;
    maxNumThreads_i: number;
    debug_i: boolean;
    PORT_i: number;
    trajectoriesDiskPath_i: string;
    orcaScriptDiskPath_i: string;
}

export interface cleanInput_t {
    trajectoryDirName_r: string;
    trajectory_r: string[];
    configStr_r: string;
}

export interface pathGenerator_t {
    trajectoryDirPath_r: string;
    energyPathTxt_r: string;
    logFileDir_r: string;
}

export interface getTrajectories_t {
    moleculeName: string;
    filesInside: string[];
    numMolecule: number;
    uploadDate: string;
    partialPath: string;
}
