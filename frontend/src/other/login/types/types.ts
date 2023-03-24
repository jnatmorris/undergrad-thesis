export interface auth200_t {
    token: string;
    record: {
        id: string;
        collectionId: string;
        collectionName: string;
        created: string;
        updated: string;
        username: string;
        verified: boolean;
        emailVisibility: boolean;
        email: string;
        name: string;
        avatar: string;
    };
}

export interface login400_t {
    code: 400;
    message: "Failed to authenticate.";
    data: {
        identity: {
            code: string;
            message: string;
        };
    };
}

// ===============================

export interface notAuthorized_t {
    error: "Not authorized";
}

// ===============================

export interface authContext_t {
    startSession: (identity: string, password: string) => Promise<void>;
    endSession: () => void;
    authStorage: auth200_t | null;
}
