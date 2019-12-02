import { safeLoad, JSON_SCHEMA, Schema, YAMLException } from "js-yaml";
import { searchOptimusConfigs } from "./searcher";
import { LoadedConfig } from "./config";
import { promises } from "fs";
import optimusSchema from "./optimus.schema.json";
import { ConfigContext } from "./configContext";

export const load = async (path: string): Promise<LoadedConfig> => {
    const fileContent = await promises.readFile(path, {
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

export const searchAndLoadAll = async (rootPath: string): Promise<ConfigContext[]> => {
    const files = await searchOptimusConfigs(rootPath);

    return Promise.all(files.map(async (path: string) => {
        const loadedConfig = await load(path);
        return {
            loadedConfig: loadedConfig,
            path: path
        };
    }));
};