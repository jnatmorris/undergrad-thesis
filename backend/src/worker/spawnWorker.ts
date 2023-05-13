import type { workerData_t } from "../types/types";
import { parentPort, workerData } from "worker_threads";
import { extname } from "path";
import { writeFileSync_w } from "../wrappers/writeFileSync_w";
import { rmSync_w } from "../wrappers/rmSync_w";
import { execSync_w } from "../wrappers/execSync_w";
import { readdirSync_w } from "../wrappers/readdirSync_w";
import { renameSync_w } from "../wrappers/renameSync_w";
import { mkdirSync_w } from "../wrappers/mkdirSync_w";
import { v4 as uuidv4 } from "uuid";

const {
    orcaScriptDiskPath_i,
    threadMolecules,
    trajectoryDirPath_r,
    configStr_r,
} = workerData as workerData_t;

// for each of the molecules in the set for the thread to compute...
threadMolecules.forEach((fileStr) => {
    /*
        1. Make molecule directory to do calculations within
        2. Create the config and write into directory
        3. Write the single molecule into file in directory
        4. Run orca passing the path to molecule and config
        5. Read items in molecule directory and remove all that are not .log
        6. Move the .log file one directory lower in the tree
        7. Remove the molecule folder
        8. Get the values from Orca 
        9. message to parent thread
        10. When ALL molecules are finished, let parent know that the thread is completely finished
    */

    // generate a unique ID for the molecule
    const moleculeID = uuidv4();

    // 1. make molecule folder
    const moleculeFolderPath = `${trajectoryDirPath_r}/logFiles/molecule_${moleculeID}`;
    mkdirSync_w(moleculeFolderPath);

    // 2. write config to path
    const moleculePath = `./${trajectoryDirPath_r}/logFiles/molecule_${moleculeID}/molecule.xyz`;
    const configFile = `${configStr_r}\n\n* xyzfile 0 1 ${moleculePath}\n`;
    const configPath = `${moleculeFolderPath}/orcaConfig.xyz.inp`;
    writeFileSync_w(configPath, configFile);

    // 3. wite molecule to path
    writeFileSync_w(moleculePath, fileStr);

    // 4. run orca and pass the config file path
    const orcaOutput = execSync_w(
        `bash ${orcaScriptDiskPath_i}/runOrca.sh ${configPath} ${moleculeFolderPath}/${moleculeID}.log`
    );

    // 5. Remove not .log files
    const filesInDir = readdirSync_w(moleculeFolderPath);
    const fileIndex = filesInDir.findIndex((x) => extname(x) === ".log");

    // 6. Move .log file
    renameSync_w(
        `${moleculeFolderPath}/${filesInDir[fileIndex]}`,
        `${trajectoryDirPath_r}/logFiles/${filesInDir[fileIndex]}`
    );

    // 7. Remove molecule folder
    rmSync_w(moleculeFolderPath, { recursive: true, force: true });

    // 8. get output and format
    const cleanedOutput = orcaOutput.split("\n").map((x) => x.trim());
    const formattedStr = `Molecule:${moleculeID},Excited:${cleanedOutput[0]},Ground:${cleanedOutput[1]}\n`;

    // 10. message parent
    parentPort?.postMessage({
        finished: false,
        formattedStr,
    });
});

// 11. message parent when all completed
parentPort?.postMessage({
    finished: true,
});
