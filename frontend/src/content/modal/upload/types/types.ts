// ============================================================
// types for zustand store

export interface useUserInputStoreActions_t {
    setNumThreads: (qty: number) => void;
    setConfigFile: (newConfig: File) => void;
    resetInputStore: () => void;
    setTrajectoryData: (newTrajectoryFile: File) => void;
}

export interface trajectoryData_t {
    trajectoryData: {
        trajectoryFile: File | null;
        trajectoriesStr: string[][] | null;
        numMolecules: number | null;
    };
}

export type useUserInputStoreTrajectoryState_t =
    trajectoryData_t["trajectoryData"];

export interface useUserInputStoreState_t {
    configFile: File | null;
    numThreads: number;
}

// ============================================================
// reducer types
export interface molViewerState_t {
    currentMol: number;
    toolTip: {
        showToolTip: boolean;
        elemLetter: string;
        x: number;
        y: number;
        z: number;
    };
}

export type MoleculeViewActions_t =
    | {
          type: "increment";
          payload: null;
      }
    | {
          type: "decrement";
          payload: null;
      }
    | {
          type: "setShowToolTip";
          payload: {
              showToolTip: boolean;
              elemLetter: string;
              x: number;
              y: number;
              z: number;
          };
      };
