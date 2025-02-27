import * as dotenv from 'dotenv'
dotenv.config()

import { initDataset } from "braintrust";
 
async function main() {
  const dataset = initDataset(process.env.PROJECT_NAME, { dataset: process.env.DATASET_NAME });
  for (let i = 0; i < 5; i++) {
    const id = dataset.insert({
      input: i,
      expected: { result: i + 1, error: null },
      metadata: { foo: i % 2 },
    });
    console.log("Inserted record with id", id);
  }
 
  console.log(await dataset.summarize());
}
 
main();