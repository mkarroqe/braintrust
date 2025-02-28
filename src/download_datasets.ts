import * as dotenv from 'dotenv'
dotenv.config()

import * as fs from 'fs'
import { ListDatasetsResponse, FetchDatasetResponse } from './datasets'
import { escapeCsvValue } from './utils'

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

export async function downloadDatasetsToCsv(projectName: string, destDir: string): Promise<Boolean> {
  const datasetList = await listDatasets(projectName);
  if (datasetList.objects.length == 0) { 
    console.error("No datasets found for " + projectName + ".");
    return false;
  }

  // NOTE: assumption
  const excludedFields = ['_xact_id', 'created', 'project_id', 'dataset_id', 'span_id', 'metrics', 'context', 'span_parents', 'root_span_id', 'is_root', 'origin'];

  for (const dataset of datasetList.objects) {
    const fetchedDataset = await fetchDataset(dataset.id);

      // Check if dataset is empty
      if (!fetchedDataset.events || fetchedDataset.events.length === 0) {
        console.warn("Dataset", dataset.name, " is empty: Skipping.");
        continue;
      }

      const filename = `${destDir}/dataset_${dataset.name}.csv`;

      const csvHeadersArray = Object.keys(fetchedDataset.events[0])
        .filter(key => !excludedFields.includes(key));
      const csvHeaders = csvHeadersArray.join(',');

      const csvRows = fetchedDataset.events.map(event => {
        return csvHeadersArray.map(key => {
            const value = event[key as keyof FetchDatasetResponse['events'][0]];
            return escapeCsvValue(value);
        }).join(',');
      }).join('\n');

      const csvContent = `${csvHeaders}\n${csvRows}`;
      fs.writeFileSync(filename, csvContent);

      console.log("Successfully downloaded", dataset.name, "to", filename + ".");
  };
  
  return true;
}