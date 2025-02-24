import * as dotenv from 'dotenv'
dotenv.config()

import * as fs from 'fs'
import * as path from 'path'

// list out all datasets 
// from /api/Datasets#list-datasets
export interface ListDatasetsResponse {
  /**
   * A list of dataset objects
   */
  objects: {
    /**
     * Unique identifier for the dataset
     */
    id: string;
    /**
     * Unique identifier for the project that the dataset belongs under
     */
    project_id: string;
    /**
     * Name of the dataset. Within a project, dataset names are unique
     */
    name: string;
    /**
     * Textual description of the dataset
     */
    description?: string;
    /**
     * Date of dataset creation
     */
    created?: string;
    /**
     * Date of dataset deletion, or null if the dataset is still active
     */
    deleted_at?: string;
    /**
     * Identifies the user who created the dataset
     */
    user_id?: string;
    /**
     * User-controlled metadata about the dataset
     */
    metadata?: {
      [k: string]: {
        [k: string]: unknown;
      };
    };
  }[];
}
 
// fetch the events in a dataset
// from /api/Datasets#fetch-dataset-get-from
export interface FetchDatasetResponse {
  /**
   * A list of fetched events
   */
  events: {
    /**
     * A unique identifier for the dataset event. If you don't provide one, BrainTrust will generate one for you
     */
    id: string;
    /**
     * The transaction id of an event is unique to the network operation that processed the event insertion. Transaction ids are monotonically increasing over time and can be used to retrieve a versioned snapshot of the dataset (see the `version` parameter)
     */
    _xact_id: string;
    /**
     * The timestamp the dataset event was created
     */
    created: string;
    /**
     * Unique identifier for the project that the dataset belongs under
     */
    project_id: string;
    /**
     * Unique identifier for the dataset
     */
    dataset_id: string;
    /**
     * The argument that uniquely define an input case (an arbitrary, JSON serializable object)
     */
    input?: {
      [k: string]: unknown;
    };
    /**
     * The output of your application, including post-processing (an arbitrary, JSON serializable object)
     */
    expected?: {
      [k: string]: unknown;
    };
    /**
     * A dictionary with additional data about the test example, model outputs, or just about anything else that's relevant, that you can use to help find and analyze examples later. For example, you could log the `prompt`, example's `id`, or anything else that would be useful to slice/dice later. The values in `metadata` can be any JSON-serializable type, but its keys must be strings
     */
    metadata?: {
      /**
       * The model used for this example
       */
      model?: string;
      [k: string]: {
        [k: string]: unknown;
      } | unknown; // NOTE: modified index signature, differs from api docs
    };
    /**
     * A list of tags to log
     */
    tags?: string[];
    /**
     * A unique identifier used to link different dataset events together as part of a full trace. See the [tracing guide](https://www.braintrust.dev/docs/guides/tracing) for full details on tracing
     */
    span_id: string;
    /**
     * A unique identifier for the trace this dataset event belongs to
     */
    root_span_id: string;
    /**
     * Whether this span is a root span
     */
    is_root?: boolean;
    /**
     * Indicates the event was copied from another object.
     */
    origin?: {
      /**
       * Type of the object the event is originating from.
       */
      object_type: ("experiment" | "dataset" | "prompt" | "function" | "prompt_session") | "project_logs";
      /**
       * ID of the object the event is originating from.
       */
      object_id: string;
      /**
       * ID of the original event.
       */
      id: string;
      /**
       * Transaction ID of the original event.
       */
      _xact_id: string;
      /**
       * Created timestamp of the original event. Used to help sort in the UI
       */
      created?: string;
    };
  }[];
  /**
   * Pagination cursor
   *
   * Pass this string directly as the `cursor` param to your next fetch request to get the next page of results. Not provided if the returned result set is empty.
   */
  cursor?: string;
}

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

export async function downloadDatasetsToCsv(projectName: string) {
  const datasetList = await listDatasets(projectName);
  
  datasetList.objects.forEach(async dataset => {
      const fetchedDataset = await fetchDataset(dataset.id);
      const filename = `${projectName}/dataset_${dataset.name}.csv`;

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