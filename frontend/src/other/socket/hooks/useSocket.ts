import React from "react";
import { toast } from "react-hot-toast";
import io from "socket.io-client";

const socket = io("localhost:3002");
// const socket = io("http://10.72.2.114:3002");

interface useSocket_props {
    debug: boolean;
}

interface reducerState_t {
    file: File | null;
    progress: number[];
    numMolecules: number | null;
    isConnected: boolean | null;
    currentlySending: boolean | null;
}

type action =
    | {
          type: "newProgress";
          payload: number;
      }
    | {
          type: "setFile";
          payload: { file: File; numMolecule: number };
      }
    | {
          type: "setConnected";
          payload: boolean;
      }
    | {
          type: "setSending";
          payload: boolean;
      };

export const useSocket = ({ debug }: useSocket_props) => {
    const reducer = (
        state: reducerState_t,
        { type, payload }: action
    ): reducerState_t => {
        switch (type) {
            case "newProgress":
                // if already computed, something went wrong
                if (state.progress.includes(payload)) return { ...state };

                return { ...state, progress: [...state.progress, payload] };
            case "setFile":
                return {
                    ...state,
                    file: payload.file,
                    numMolecules: payload.numMolecule,
                };

            case "setConnected":
                return {
                    ...state,
                    isConnected: payload,
                };

            case "setSending":
                return {
                    ...state,
                    currentlySending: payload,
                };

            default:
                throw new Error("");
        }
    };

    const [state, dispatch] = React.useReducer(reducer, {
        file: null,
        progress: [],
        numMolecules: null,
        isConnected: socket.connected,
        currentlySending: null,
    });

    const startSending = () => {
        if (!state.file) return;

        dispatch({ type: "setSending", payload: true });

        socket.emit("fileData", {
            trajectory: state.file,
            userReqThreads: 3,
            trajectoryName: state.file.name,
        });
    };

    React.useEffect(() => {
        if (state.isConnected) {
            toast.dismiss("notConnected");
            toast.success("Connected to server", {
                id: "connected",
            });
            dispatch({ type: "setSending", payload: false });
        } else {
            toast.dismiss("connected");
            toast.error("Not connected to server", {
                id: "notConnected",
            });
        }
    }, [state.isConnected]);

    React.useEffect(() => {
        socket.on("connect", () => {
            dispatch({ type: "setConnected", payload: true });
        });

        socket.on("sendProgress", (data: number) => {
            dispatch({ type: "newProgress", payload: data });
        });

        socket.on("disconnect", (reason) => {
            dispatch({ type: "setConnected", payload: false });
            dispatch({ type: "setSending", payload: false });

            console.log(reason);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("sendProgress");
        };
    }, []);

    return {
        startSending,
        dispatch,
        state,
    };
};
