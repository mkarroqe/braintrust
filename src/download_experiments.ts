import * as dotenv from 'dotenv'
dotenv.config()

import * as fs from 'fs'
import { ListExperimentsResponse, FetchExperimentResponse } from './experiments';

async function listExperiments(projectName: string): Promise<ListExperimentsResponse> {
    return fetch(`https://api.braintrust.dev/v1/experiment?project_name=${projectName}`, {
        headers: {
          "Authorization": `Bearer ${process.env.BRAINTRUST_API_KEY}`
        }
      }).then(res => res.json()).then(res => { return res as ListExperimentsResponse});
}
     
async function fetchExperiment(experimentId: string): Promise<FetchExperimentResponse> {
    return fetch(`https://api.braintrust.dev/v1/experiment/${experimentId}/fetch`, {
        headers: {
          "Authorization": `Bearer ${process.env.BRAINTRUST_API_KEY}`
        }
      }).then(res => res.json()).then(res => { return res as FetchExperimentResponse});
}

export async function downloadExperimentsToCsv(projectName: string, destDir: string): Promise<Boolean> {
    const experimentsList = await listExperiments(projectName);
    if (experimentsList.objects.length == 0) { 
        console.error("No experiments found for " + projectName + ". Exiting.");
        return false;
    }
    experimentsList.objects.forEach(async experiment => {
        const fetchedExperiment = await fetchExperiment(experiment.id);
        const filename = `${destDir}/experiment_${experiment.name}.csv`;

        const csvHeaders = Object.keys(fetchedExperiment.events[0]).join(',');
        const csvRows = fetchedExperiment.events.map(event => {
            return Object.keys(event).map(key => {
                const value = event[key as keyof FetchExperimentResponse['events'][0]];
                if (typeof value === 'object' && value !== null) {
                    return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        }).join('\n');

        const csvContent = `${csvHeaders}\n${csvRows}`;
        fs.writeFileSync(filename, csvContent);
        
        console.log("Successfully downloaded experiments to" + filename + ".");
        return true;
    });
}