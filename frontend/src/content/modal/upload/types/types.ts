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
