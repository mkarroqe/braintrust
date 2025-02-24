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

// hard-coded test code
downloadProjectToCsv("Explorations");