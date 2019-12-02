import { Uri, workspace } from "vscode";
import { configName } from "./config";
import { sync } from "glob";

export const searchOptimusConfigs = async (rootFolder: string): Promise<string[]> => {
    const optimusFiles = await sync(`${rootFolder}/**/${configName}!(node_modules)`);

    optimusFiles.forEach((u: Uri) => {
        console.log(u.toString());
    });

    return optimusFiles;
};