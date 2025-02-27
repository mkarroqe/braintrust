import * as dotenv from 'dotenv'
dotenv.config()

import { initDataset, Eval } from "braintrust";
import { Levenshtein, ExactMatch } from "autoevals";
 
function output(name: string): string {
    if (name == "Foo") return "Hi " + name;
    return "Squawk " + name;
}

Eval(
  process.env.PROJECT_NAME,
  {
    data: initDataset(`${process.env.PROJECT_NAME}`, { dataset: `${process.env.DATASET_NAME}` }),
    task: async (input) => {
      return output(input); 
    },
    scores: [Levenshtein, ExactMatch],
  },
);