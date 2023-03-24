export interface runOrca_t {
    trajectoryName: string;
    trajectory: Buffer;
    orcaConfig: Buffer;
    userReqThreads: number;
}

export interface threadRes_t {
    moleculeNumber: number;
    formattedStr: string;
}

export interface workerData_t {
    folderName: string;
    startIndex: number;
    endIndex: number;
    molecules: string[];
}

export interface envCheck_t {
    maxFileSize: number;
    maxNumThreads: number;
    debug: boolean;
    PORT: number;
}

export interface cleanInput_t {
    cleanName: string;
    cleanTrajectory: string[];
}

export interface pathGenerator_t {
    trajectoryDir: string;
    energyTxt: string;
    logFileDir: string;
}
