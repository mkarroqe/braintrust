import * as dotenv from 'dotenv'
dotenv.config()

import * as fs from 'fs'
import { ListDatasetsResponse, FetchDatasetResponse } from './datasets'

// list all datasets of projectName
async function listDatasets(projectName: string): Promise<ListDatasetsResponse> {
    return fetch(`https://api.braintrust.dev/v1/dataset?project_name=${projectName}`, {
        headers: {
          "Authorization": `Bearer ${process.env.BRAINTRUST_API_KEY}`
        }
      }).then(res => res.json()).then(res => { return res as ListDatasetsResponse});
}

async function fetchDataset(datasetId: string): Promise<FetchDatasetResponse> {
  return fetch(`https://api.braintrust.dev/v1/dataset/${datasetId}/fetch`, {
      headers: {
        "Authorization": `Bearer ${process.env.BRAINTRUST_API_KEY}`
      }
    }).then(res => res.json()).then(res => { return res as FetchDatasetResponse});
}

export async function downloadDatasetsToCsv(projectName: string, destDir: string) {
  const datasetList = await listDatasets(projectName);
  
  datasetList.objects.forEach(async dataset => {
      const fetchedDataset = await fetchDataset(dataset.id);
      const filename = `${destDir}/dataset_${dataset.name}.csv`;

      const csvHeaders = Object.keys(fetchedDataset.events[0]).join(',');
      const csvRows = fetchedDataset.events.map(event => {
          return Object.keys(event).map(key => {
              const value = event[key as keyof FetchDatasetResponse['events'][0]];
              if (typeof value === 'object' && value !== null) {
                  return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
              }
              return value;
          }).join(',');
      }).join('\n');

      const csvContent = `${csvHeaders}\n${csvRows}`;
      fs.writeFileSync(filename, csvContent);
  });
}