import { searchAndLoadAll } from '../optimusConfig/loader';
import { ConfigContext } from '../optimusConfig/configContext';
import { ConfigQuickPickItem } from '../optimusConfig/configQuickPick';
import { writeErrors } from "../optimusConfig/errorWriter";
import { checkAndGetWorkspace } from '../checkAndGetWorkspace';
import { window, workspace, ViewColumn } from 'vscode';

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
      window.createWebviewPanel("test", "test", {
        viewColumn: ViewColumn.Two

      }, {

      });

      /*
.then((val: vscode.Uri[]) => {
  
const panel = vscode.window.createWebviewPanel("test", "test", {
viewColumn: vscode.ViewColumn.Two
  
}, {
  
});
});*/

    }

    window.showInformationMessage(pick.label);
  }

};
