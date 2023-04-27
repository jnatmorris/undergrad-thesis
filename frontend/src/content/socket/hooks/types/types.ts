import type { trajectoriesOnDiskBase_t } from "../../zustand/types/types";

// type used for the incoming data from socket
export interface trajectoriesOnDiskBaseEmit_t extends trajectoriesOnDiskBase_t {
    uploadDate: string;
}

export interface resFile_t {
    file: Buffer;
    fileName: string;
}
