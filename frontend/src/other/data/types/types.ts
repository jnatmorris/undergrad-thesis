export interface data_t {
    page: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
    items: itemData_t[];
}

export interface itemData_t {
    id: string;
    collectionId: string;
    collectionName: string;
    created: Date;
    updated: Date;
    xyzFile: string;
    groundStateEnergy: number;
    excitedStateEnergy: number;
    numAtoms: number;
    parameters: object;
}

export interface getRecords400_t {
    page: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
    items: {
        id: string;
        collectionId: string;
        collectionName: string;
        created: string;
        updated: string;
        xyzFile: string;
        groundStateEnergy: number;
        excitedStateEnergy: number;
        numAtoms: number;
        parameters: string;
    }[];
}
