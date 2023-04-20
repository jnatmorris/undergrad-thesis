import { parentPort, workerData } from "worker_threads";
import { writeFileSync, readdirSync, mkdirSync, renameSync, rmSync } from "fs";
import { extname } from "path";
import { execSync } from "child_process";
import type { workerData_t } from "../types/types";

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
    mkdirSync(moleculeFolderPath);

    // ===================================================
    // make config and write config file

    const moleculePath = `./${trajectoryDirPath_r}/logFiles/molecule_${moleculeNumber}/molecule.xyz`;
    const configFile = `${configStr_r}\n\n* xyzfile 0 1 ${moleculePath}\n`;
    const configPath = `${moleculeFolderPath}/orcaConfig.xyz.inp`;

    // write config
    writeFileSync(configPath, configFile);
    // write file
    writeFileSync(moleculePath, fileStr);

    // ===================================================
    // run orca and pass the config file path
    const orcaOutput = execSync(
        `bash ${orcaScriptDiskPath_i}/runOrca.sh ${configPath} ${moleculeFolderPath}/temp_${moleculeNumber}.log`,
        {
            encoding: "utf-8",
        }
    );

    // ===================================================
    // cleanup

    const filesInDir = readdirSync(moleculeFolderPath);

    const fileIndex = filesInDir.findIndex((x) => extname(x) === ".log");

    // move file
    renameSync(
        `${moleculeFolderPath}/${filesInDir[fileIndex]}`,
        `${trajectoryDirPath_r}/logFiles/${filesInDir[fileIndex]}`
    );

    rmSync(moleculeFolderPath, { recursive: true, force: true });

    // // ===================================================
    // // get output and format

    const cleanedOutput = orcaOutput.split("\n").map((x) => x.trim());

    const formattedStr = `Molecule:${moleculeNumber},Lowest Energy:${cleanedOutput[0]},Maximum Energy change:${cleanedOutput[1]}\n`;

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
