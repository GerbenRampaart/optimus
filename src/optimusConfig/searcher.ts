import { Uri, workspace } from "vscode";
import { configName } from "./config";

export const searchOptimusConfigs = async (): Promise<Uri[]> => {
    const optimusFiles = await workspace.findFiles(`**/${configName}`, "node_modules");

    optimusFiles.forEach((u: Uri) => {
        console.log(u.toString());
    });

    return optimusFiles;
};