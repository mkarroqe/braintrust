import * as fs from 'fs'
import * as path from 'path'
import { downloadExperimentsToCsv } from './download_experiments';
import { downloadDatasetsToCsv } from './download_datasets';

async function downloadProjectToCsv(projectName: string) {
    // TODO: check for existing/create project folder
    fs.mkdir(path.join(projectName),
        (err: any) => {
            if (err) {
                return console.error(err);
            }
    }); 
    downloadExperimentsToCsv(projectName);
    downloadDatasetsToCsv(projectName);
  }
  
downloadProjectToCsv("Explorations");