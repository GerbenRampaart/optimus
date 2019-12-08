import { configName } from "./config";
import { sync } from "glob";

export const searchOptimusConfigs = (rootFolder: string): string[] => {
    const optimusFiles = sync(`${rootFolder}/**/${configName}`, {
        ignore: [
            "**/node_modules/**", 
            "./node_modules/**"
        ]
    });

/*
    optimusFiles.forEach((u: string) => {
        console.debug(u.toString());
    });
*/
    return optimusFiles;
};