import type { workerData_t } from "../types/types";
import { parentPort, workerData } from "worker_threads";
import { extname } from "path";
import { writeFileSync_w } from "../wrappers/writeFileSync_w";
import { rmSync_w } from "../wrappers/rmSync_w";
import { execSync_w } from "../wrappers/execSync_w";
import { readdirSync_w } from "../wrappers/readdirSync_w";
import { renameSync_w } from "../wrappers/renameSync_w";
import { mkdirSync_w } from "../wrappers/mkdirSync_w";

const {
    totalNumMolecules,
    orcaScriptDiskPath_i,
    startIndex,
    threadMolecules,
    trajectoryDirPath_r,
    configStr_r,
} = workerData as workerData_t;

threadMolecules.forEach((fileStr, index) => {
    const moleculeNumber = index + startIndex;

    // ===================================================
    // make molecule folder
    const moleculeFolderPath = `${trajectoryDirPath_r}/logFiles/molecule_${moleculeNumber}`;
    mkdirSync_w(moleculeFolderPath);

    // ===================================================
    // make config and write config file

    const moleculePath = `./${trajectoryDirPath_r}/logFiles/molecule_${moleculeNumber}/molecule.xyz`;
    const configFile = `${configStr_r}\n\n* xyzfile 0 1 ${moleculePath}\n`;
    const configPath = `${moleculeFolderPath}/orcaConfig.xyz.inp`;

    // write config
    writeFileSync_w(configPath, configFile);
    // write file
    writeFileSync_w(moleculePath, fileStr);

    // ===================================================
    // run orca and pass the config file path
    const orcaOutput = execSync_w(
        `bash ${orcaScriptDiskPath_i}/runOrca.sh ${configPath} ${moleculeFolderPath}/temp_${moleculeNumber}.log`
    );

    // ===================================================
    // cleanup

    const filesInDir = readdirSync_w(moleculeFolderPath);

    const fileIndex = filesInDir.findIndex((x) => extname(x) === ".log");

    // move file
    renameSync_w(
        `${moleculeFolderPath}/${filesInDir[fileIndex]}`,
        `${trajectoryDirPath_r}/logFiles/${filesInDir[fileIndex]}`
    );

    rmSync_w(moleculeFolderPath, { recursive: true, force: true });

    // // ===================================================
    // get output and format

    const cleanedOutput = orcaOutput.split("\n").map((x) => x.trim());

    const formattedStr = `Molecule:${moleculeNumber},Excited Energy:${cleanedOutput[0]},Ground Energy:${cleanedOutput[1]}\n`;

    // ===================================================
    // message parent

    parentPort?.postMessage({
        finished: false,
        formattedStr,
    });
});

parentPort?.postMessage({
    finished: true,
    totalNumMolecules,
});
