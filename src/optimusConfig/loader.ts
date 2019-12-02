import { Uri } from "vscode";
import { safeLoad, JSON_SCHEMA, Schema, YAMLException } from "js-yaml";
import { searchOptimusConfigs } from "./searcher";
import { Config, LoadedConfig } from "./config";
import { promises } from "fs";
import optimusSchema from "./optimus.schema.json";
import { ConfigContext } from "./configContext";

export const load = async (uri: Uri): Promise<LoadedConfig> => {
    const fileContent = await promises.readFile(uri.fsPath, {
        encoding: "utf-8"
    });

    const loadedSchema = Schema.create(JSON_SCHEMA, <any>optimusSchema);
    const schemaWarnings: YAMLException[] = [];

    const onWarning = (e: YAMLException) => schemaWarnings.push(e);

    const yaml = safeLoad(
        fileContent, {
            schema: loadedSchema,
            onWarning: onWarning
        });
    
    return {
        config: yaml,
        warnings: schemaWarnings
    };
};

export const searchAndLoadAll = async (): Promise<ConfigContext[]> => {
    const files = await searchOptimusConfigs();

    return Promise.all(files.map(async (fileUri: Uri) => {
        const loadedConfig = await load(fileUri);
        return {
            loadedConfig: loadedConfig,
            uri: fileUri
        };
    }));
};