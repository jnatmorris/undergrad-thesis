import React from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useUserInputStore } from "../Zustand/useUserInputStore";
import { CheckValidExt } from "..";

interface Props {}

export const TrajectoryFileInput_c: React.FC<Props> = ({}) => {
    // access store
    const { trajectoryData, setTrajectoryData } = useUserInputStore();
    const trajectoryFileRef = React.useRef<HTMLInputElement>(null);

    const handleInputClick = (): void => {
        if (trajectoryFileRef.current) {
            trajectoryFileRef.current.value = "";
        }
    };

    // handle the showing and hiding (using invisible) depending on trajectory file state
    const invisibleClass = classNames(
        "text-center",
        "text-slate-800/80",
        "text-sm",
        {
            invisible:
                !trajectoryData.trajectoryFile ||
                !trajectoryData.trajectoryFile.name,
        }
    );

    return (
        <div className="space-y-1">
            <div className="group/DragDrop relative h-full w-full cursor-pointer rounded-lg border-[2.5px] border-dashed border-slate-300 hover:bg-slate-50/75">
                <input
                    id="fileInput"
                    type="file"
                    // give hint to browser to only allow .inp files
                    accept=".xyz"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 file:cursor-pointer"
                    // override the title of input
                    title=""
                    placeholder=""
                    // allow for the dragging and dropping of files
                    onDrop={(e) =>
                        CheckValidExt(
                            e.dataTransfer.files,
                            "xyz",
                            setTrajectoryData
                        )
                    }
                    ref={trajectoryFileRef}
                    // allow for the click to upload ability
                    onChange={(e) =>
                        CheckValidExt(e.target.files, "xyz", setTrajectoryData)
                    }
                    onClick={handleInputClick}
                />
                <div className="flex h-full flex-col items-center justify-center space-y-1">
                    <div className="flex items-end space-x-1.5">
                        <DocumentPlusIcon className="h-8 w-8 scale-100 transition-all group-hover/DragDrop:scale-110" />
                        <p className="text-md">Trajectory File Upload</p>
                    </div>
                    <p className={invisibleClass}>
                        {trajectoryData.trajectoryFile?.name}
                    </p>
                </div>
            </div>
        </div>
    );
};
