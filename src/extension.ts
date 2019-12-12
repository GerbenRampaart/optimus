// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands, window, workspace } from 'vscode';
import { searchAndLoadAll } from './optimusConfig/loader';
import { ConfigContext } from './optimusConfig/configContext';
import { ConfigQuickPickItem } from './optimusConfig/configQuickPick';
import { writeErrors } from "./optimusConfig/errorWriter";
import { getOptimusExampleConfig } from './optimusExample/optimusExampleConfig';
import { promises } from 'fs';
import { join } from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export const activate = async (context: ExtensionContext) => {

	let disposableExample = commands.registerCommand('extension.optimus.example', async () => {
		//window.showWarningMessage("example");
		
		if (!workspace.workspaceFolders) {
			window.showWarningMessage("Optimus only works with an open folder", {
				modal: true
			});
			return;
		}

		const root = workspace.workspaceFolders[0].uri.fsPath;

		const example = getOptimusExampleConfig();
		await promises.writeFile(join(root, ".optimus"), example, {
			encoding: "utf8"
		});
	});

	let disposableTransform = commands.registerCommand('extension.optimus.transform', async () => {

		// No folder opened
		if (!workspace.workspaceFolders) {
			window.showWarningMessage("Optimus only works with an open folder", {
				modal: true
			});
			return;
		}

		const root = workspace.workspaceFolders[0].uri.fsPath;
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

				/*
		.then((val: vscode.Uri[]) => {
			
			const panel = vscode.window.createWebviewPanel("test", "test", {
				viewColumn: vscode.ViewColumn.Two
				
			}, {
				
			});
		});*/

		const quickPicks: ConfigQuickPickItem[] = [];
		
		configFiles.forEach((cc: ConfigContext) => {
			quickPicks.push(new ConfigQuickPickItem(cc));
		});

		//quickPicks.push(new ConfigExampleQuickPickItem());

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


			}

			window.showInformationMessage(pick.label);
		}
		
	});

	context.subscriptions.push(disposableExample);
	context.subscriptions.push(disposableTransform);
};

// this method is called when your extension is deactivated
export function deactivate() {}
