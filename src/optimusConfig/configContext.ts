import { Config } from "./config";
import { Uri } from "vscode";

export interface ConfigContext {
    config: Config;
    uri: Uri;
}