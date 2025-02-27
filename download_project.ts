import * as fs from 'fs'
import * as path from 'path'
import { downloadExperimentsToCsv } from './src/download_experiments';
import { downloadDatasetsToCsv } from './src/download_datasets';

async function downloadProjectToCsv(projectName: string) {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const destDir = path.join('local_projects', `${projectName}-${timestamp}`);
    try {
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, {recursive: true});
        }
    } catch (err) {
        console.error(err);
    }
    await downloadExperimentsToCsv(projectName, destDir);
    await downloadDatasetsToCsv(projectName, destDir);
  }

const projectNameArg = process.argv[2];
if (!projectNameArg) {
    console.error("Please enter your project name as an arg.");
} else {
    downloadProjectToCsv(projectNameArg);
}