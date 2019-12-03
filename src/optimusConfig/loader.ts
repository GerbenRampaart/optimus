import { safeLoad } from "js-yaml";
import { searchOptimusConfigs } from "./searcher";
import { LoadedConfig } from "./config";
import { promises } from "fs";
import optimusSchema from "./optimus.schema.json";
import { ConfigContext } from "./configContext";
import { Validator, validate } from "jsonschema";

export const load = async (path: string): Promise<LoadedConfig> => {
    const fileContent = await promises.readFile(path, {
        encoding: "utf-8"
    });

    const yaml = safeLoad(fileContent);

    // https://github.com/tdegrunt/jsonschema
    var v = new Validator();
    const validatorResult = v.validate(yaml || {}, optimusSchema, {
        allowUnknownAttributes: true,
        throwError: false
    });

    return {
        raw: fileContent,
        config: yaml,
        validatorResult: validatorResult
    };
};

export const searchAndLoadAll = async (rootPath: string): Promise<ConfigContext[]> => {
    const files = await searchOptimusConfigs(rootPath);

    return Promise.all(files.map(async (path: string) => {
        const loadedConfig = await load(path);
        return {
            loadedConfig: loadedConfig,
            path: path,
            relativePath: path.substr(rootPath.length)
        };
    }));
};