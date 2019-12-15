import { promises } from "fs";
import { join } from "path";
import { window, workspace } from 'vscode';
import { configName } from "../optimusConfig/config";
import { getOptimusExampleConfig } from "../optimusExample/optimusExampleConfig";
import { checkAndGetWorkspace } from "../checkAndGetWorkspace";
import * as sample from "../optimusExample/sample.json";
import { load } from "../optimusConfig/loader";

export const example = async () => {
  const root = checkAndGetWorkspace();
  if (!root) { return; }

  const targetDir = await window.showInputBox({
    ignoreFocusOut: false,
    password: false,
    prompt: "What directory do you want the example placed in?"
  });

  if (!targetDir) {
    return;
  }

  const examplePath = join(root, targetDir);

  try {
    await promises.access(examplePath);

    window.showWarningMessage(`Directory ${examplePath} already exists. Optimus wouldn't want to override your files :-(`, {
      modal: true
    });
    return;
  } catch (error) {
    // This exception means the dir does not exist. Which is good.
    await promises.mkdir(examplePath, {
      recursive: true
    });
  }

  const example = getOptimusExampleConfig();
  const configPath = join(examplePath, configName);

  await promises.writeFile(configPath, example, {
    encoding: "utf8"
  });

  // Re-load the example from the file
  const loadedConfig = await load(configPath);

  // Since we just generated the example ourselves we know it's valid.
  const config = loadedConfig.config!;
  const samplePath = join(examplePath, config.sample);

  await promises.writeFile(samplePath, JSON.stringify(sample), {
    encoding: "utf8"
  });

  const transformerPath = join(examplePath, config.transformer);

  await promises.writeFile(samplePath, JSON.stringify(sample), {
    encoding: "utf8"
  });


  const docToBeExamined = await workspace.openTextDocument(configPath);
  await window.showTextDocument(docToBeExamined);
};
