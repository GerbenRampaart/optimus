import { searchAndLoadAll } from '../optimusConfig/loader';
import { ConfigContext } from '../optimusConfig/configContext';
import { ConfigQuickPickItem } from '../optimusConfig/configQuickPick';
import { writeErrors } from "../optimusConfig/errorWriter";
import { checkAndGetWorkspace } from '../checkAndGetWorkspace';
import { window, workspace, ViewColumn, commands } from 'vscode';
import { join } from 'path';
import { EOL } from 'os';
import { promises } from 'fs';

export const transform = async () => {
  const root = checkAndGetWorkspace();
  if (!root) { return; }

  const configFiles = await searchAndLoadAll(root);

  if (configFiles.length === 0) {
    window.showWarningMessage("Optimus didn't find any config files. 'Optimus: Generate Example' will generate an example for you.", {
      modal: true
    });
    return;
  }

  configFiles.forEach(async (cc: ConfigContext) => {
    await writeErrors(cc);
  });

  const quickPicks: ConfigQuickPickItem[] = [];

  configFiles.forEach((cc: ConfigContext) => {
    quickPicks.push(new ConfigQuickPickItem(cc));
  });

  const quickPick = window.createQuickPick<ConfigQuickPickItem>();

  quickPick.items = quickPicks;
  quickPick.canSelectMany = false;

  const pick = await new Promise<ConfigQuickPickItem | undefined>((resolve) => {
    quickPick.onDidChangeSelection((cqpi: ConfigQuickPickItem[]) => {
      quickPick.hide();
      resolve(cqpi[0]);
    });

    quickPick.onDidHide(() => {
      quickPick.dispose();
      resolve(undefined);
    });

    quickPick.show();
  });

  if (pick) {

    if (pick.configContext.loadedConfig.validatorResult.errors.length > 0) {
      const docToBeCorrected = await workspace.openTextDocument(pick.configContext.path);
      await window.showTextDocument(docToBeCorrected);

      window.showWarningMessage("Please correct any errors in this Optimus config and restart the transform with 'Optimus: Transform'", {
        modal: true
      });
      return;
    } else {

      const config = pick.configContext.loadedConfig.config!;

      const output = window.createWebviewPanel("test", "test", {
        viewColumn: ViewColumn.Two
      });

      const transformerPath = join(pick.configContext.dir, config.transformer);
      const samplePath = join(pick.configContext.dir, config.sample);
      const sample = await promises.readFile(samplePath, {
        encoding: "utf-8"
      });

      //const sampleJson = JSON.parse(sample);

      const inputDocument = await workspace.openTextDocument(transformerPath);

      const outputEditor = await window.showTextDocument(inputDocument, {
        viewColumn: ViewColumn.One
      });

      // https://github.com/microsoft/vscode/issues/65876
      commands.registerCommand("type", async (items: any[]) => {

        let transformerTarget = outputEditor.document.getText();
        transformerTarget += `${EOL}module.exports.___transformed = ${config.function}(${sample});`;
        console.log(transformerTarget);
        let result: any = {};

        try {
          result = eval(transformerTarget);
        } catch (error) {
          console.error(error);
        }
        
        console.log(result.___transformed);
        output.webview.html = JSON.stringify(result.___transformed);
        await commands.executeCommand("default:type", items);
      });

    }

  }

};
