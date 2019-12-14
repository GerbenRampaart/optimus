import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { path } from "app-root-path";
import { searchAndLoadAll } from '../../optimusConfig/loader';
import { ConfigContext } from '../../optimusConfig/configContext';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test("Test reading the config file", async () => {
		const configs = await searchAndLoadAll(path);
		const config = configs[0].loadedConfig.config;
		
		if (config) {
			assert.equal(config.function, "myTransformer");
			assert.equal(config.name, "myTransformation");
			assert.equal(config.sample, "sample.json");
			assert.equal(config.transformer, "transformer.js");	
		}
	});

	test("Test searching and loading", async () => {
		const configs = await searchAndLoadAll(path);
		configs.forEach((cc: ConfigContext) => {
			console.log(cc.loadedConfig.validatorResult.errors);
		});
		
	});

});
