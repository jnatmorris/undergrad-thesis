import React from "react";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useUserInputStore } from "../Zustand/useUserInputStore";
import { CheckValidExt } from "../";

interface Props {}

export const ConfigFileInput_c: React.FC<Props> = ({}) => {
    const { setConfigFile, configFile } = useUserInputStore();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleInputClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // handle the showing and hiding (using invisible) depending on config file state
    const invisibleClass = classNames(
        "text-center",
        "text-slate-800/80",
        "text-sm",
        {
            invisible: !configFile || !configFile.name,
        }
    );

    return (
        <div className="space-y-1">
            <div className="group/DragDrop relative h-full w-full cursor-pointer rounded-lg border-[2.5px] border-dashed border-slate-300 hover:bg-slate-50/75">
                <input
                    id="configInput"
                    type="file"
                    // give hint to browser to only allow .inp files
                    accept=".inp"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 file:cursor-pointer"
                    // emit a placeholder as a custom one is below
                    placeholder=""
                    // allow for the dragging and dropping of files
                    onDrop={(e) =>
                        CheckValidExt(
                            e.dataTransfer.files,
                            "inp",
                            setConfigFile
                        )
                    }
                    // allow for the click to upload ability
                    onChange={(e) =>
                        CheckValidExt(e.target.files, "inp", setConfigFile)
                    }
                    onClick={handleInputClick}
                    // override the title of input
                    title=""
                    ref={fileInputRef}
                />
                <div className="flex h-full flex-col items-center justify-center space-y-2">
                    <div className="flex items-end space-x-1.5">
                        <WrenchScrewdriverIcon className="h-8 w-8 scale-100 transition-all group-hover/DragDrop:scale-110" />
                        <p className="text-md">Orca Config Upload</p>
                    </div>
                    <p className={invisibleClass}>{configFile?.name}</p>
                </div>
            </div>
        </div>
    );
};
