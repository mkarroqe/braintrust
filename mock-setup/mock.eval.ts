import * as dotenv from 'dotenv'
dotenv.config()

import { initDataset, Eval } from "braintrust";
import { Levenshtein, ExactMatch } from "autoevals";
 
function isSpam(message: string): boolean {
    return !message.includes("not spam");
}

Eval(
  "canned-spam",
  {
    data: initDataset("canned-spam", { dataset: "ex(spam)ples" }),
    task: async (input) => {
      return isSpam(input).toString(); 
    },
    scores: [Levenshtein, ExactMatch],
  },
);