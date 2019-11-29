import { Uri } from "vscode";
import { safeLoad, JSON_SCHEMA } from "js-yaml";
import { searchOptimusConfigs } from "./searcher";
import { Config } from "./config";
import { promises } from "fs";

export const load = async (uri: Uri): Promise<Config & > => {
    const fileContent = await promises.readFile(uri.fsPath, {
        encoding: "utf-8"
    });


    const yaml = safeLoad(fileContent, {
        schema: JSON_SCHEMA

    });
}

export const searchAndLoadAll = async (): Promise<ConfigContext> => {
    const files = await searchOptimusConfigs();

    return files.map(async (fileUri: Uri) => {
        await load(fileUri);
    });
}