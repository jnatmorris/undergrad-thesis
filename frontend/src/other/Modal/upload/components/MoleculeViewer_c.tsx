import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
    ChevronRightIcon,
    CubeTransparentIcon,
    ChevronLeftIcon,
} from "@heroicons/react/24/solid";
import classNames from "classnames";
import type { MoleculeViewActions_t, molViewerState_t } from "../";
import { SingleElem_c } from "../";

interface Props {
    trajectoriesStr: string[][];
}

export const MoleculeViewer_c: React.FC<Props> = ({ trajectoriesStr }) => {
    // reducer function handling sate changes
    const reducer = (
        reducerState: molViewerState_t,
        { type, payload }: MoleculeViewActions_t
    ) => {
        switch (type) {
            // when asking to increment, check if at end of array. If not, allow to increment
            case "increment":
                if (reducerState.currentMol < trajectoriesStr.length - 1) {
                    return {
                        ...reducerState,
                        currentMol: reducerState.currentMol + 1,
                    };
                } else {
                    return { ...reducerState };
                }

            // when asking to decrement, check if at start of array. If not, allow to decrement
            case "decrement":
                if (reducerState.currentMol > 0) {
                    return {
                        ...reducerState,
                        currentMol: reducerState.currentMol - 1,
                    };
                } else {
                    return {
                        ...reducerState,
                    };
                }

            // allow to change the tooltip portion of the state with relevant tool tip data and
            case "setShowToolTip":
                return {
                    ...reducerState,
                    toolTip: {
                        showToolTip: payload.showToolTip,
                        elemLetter: payload.elemLetter,
                        x: payload.x,
                        y: payload.y,
                        z: payload.z,
                    },
                };
            default:
                throw new Error("error");
        }
    };

    // reducer for holding state of the 3D molecule viewer
    const [molViewerState, dispatcher] = React.useReducer(reducer, {
        currentMol: 0,
        toolTip: {
            showToolTip: false,
            elemLetter: "",
            x: 0,
            y: 0,
            z: 0,
        },
    });

    // handle the changes of classes depending on if have a trajectory file
    const invisibleClass = classNames(
        "z-50",
        "items-center",
        "flex",
        "space-x-1",
        "place-self-end",
        "selection:bg-transparent",
        { "animate-fadeIn": trajectoriesStr.length > 1 },
        { invisible: trajectoriesStr.length <= 1 }
    );

    return (
        <>
            <div className="absolute left-0 top-2 h-min w-full px-2 ">
                <div className="mb-4 grid grid-cols-2">
                    <div className="flex items-center space-x-2 place-self-start">
                        <CubeTransparentIcon className="h-5 w-5" />
                        <h4>Molecule Viewer</h4>
                    </div>

                    <div className={invisibleClass}>
                        <ChevronLeftIcon
                            className="h-6 w-6 cursor-pointer transition-all active:scale-95"
                            onClick={() =>
                                dispatcher({
                                    type: "decrement",
                                    payload: null,
                                })
                            }
                        />

                        {/* show progress through trajectory */}
                        <p>
                            {molViewerState.currentMol + 1} /{" "}
                            {trajectoriesStr.length}
                        </p>

                        <ChevronRightIcon
                            className="h-6 w-6 cursor-pointer transition-all active:scale-95"
                            onClick={() =>
                                dispatcher({
                                    type: "increment",
                                    payload: null,
                                })
                            }
                        />
                    </div>
                </div>

                {/* only show tooltips if set */}
                {molViewerState.toolTip.showToolTip && (
                    <div className="w-fit  rounded-lg px-4 py-2 shadow-md ring-2 ring-slate-100">
                        <p className="selection:bg-transparent">
                            Atom: {molViewerState.toolTip.elemLetter}
                        </p>
                        <p className="selection:bg-transparent">
                            x: {molViewerState.toolTip.x}
                        </p>
                        <p className="selection:bg-transparent">
                            y: {molViewerState.toolTip.y}
                        </p>
                        <p className="selection:bg-transparent">
                            z: {molViewerState.toolTip.z}
                        </p>
                    </div>
                )}
            </div>

            {/* employ threejs to show the 3D scene  */}
            <Canvas camera={{ position: [2, 2, 5] }}>
                <ambientLight />
                <axesHelper args={[3]} />
                <OrbitControls />
                {/* for every atom in the current molecule make an atom using the single molecule component */}
                {trajectoriesStr[molViewerState.currentMol].map(
                    (singleAtom, index) => {
                        return (
                            <SingleElem_c
                                index={index}
                                singleAtom={singleAtom}
                                key={`${molViewerState.currentMol}-${index}`}
                                dispatcher={dispatcher}
                            />
                        );
                    }
                )}
            </Canvas>
        </>
    );
};
