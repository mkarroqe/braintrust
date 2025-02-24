import * as fs from 'fs'
import * as path from 'path'
import { downloadExperimentsToCsv } from './src/download_experiments';
import { downloadDatasetsToCsv } from './src/download_datasets';

async function downloadProjectToCsv(projectName: string) {
    const destDir = path.join('local_projects', projectName);
    try {
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, {recursive: true});
        }
    } catch (err) {
        console.error(err);
    }
    downloadExperimentsToCsv(projectName, destDir);
    downloadDatasetsToCsv(projectName, destDir);
  }

const projectNameArg = process.argv[2];
if (!projectNameArg) {
    console.error("Please enter your project name as an arg.");
} else {
    downloadProjectToCsv(projectNameArg);
}