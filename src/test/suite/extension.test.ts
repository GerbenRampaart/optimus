import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { Config } from "../../optimusConfig/config";
import { safeLoad } from "js-yaml";
import { path } from "app-root-path";
import { searchAndLoadAll } from '../../optimusConfig/loader';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test("Test reading the config file", async () => {
		const configString = readFileSync(`${path}/src/sample/.optimus`, "utf-8");
		const config = safeLoad(configString) as Config;
		
		assert.equal(config.enabled, true);
		assert.equal(config.function, "myTransformer");
		assert.equal(config.name, "myTransformation");
		assert.equal(config.sample, "sample.json");
		assert.equal(config.transformer, "transformer.js");
	});

	test("Test searching and loading", async () => {
		const configs = await searchAndLoadAll(path);
		console.log(JSON.stringify(configs));
		assert.equal(configs.length, 1);
	});

});
