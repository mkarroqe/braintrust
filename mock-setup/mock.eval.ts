import { Eval } from "braintrust";
import { Levenshtein } from "autoevals";
 
function output(name: string): string {
    if (name == "Foo") return "Hi " + name;
    return "Hello " + name;
}

Eval(
  "Explorations", // Replace with your project name
  {
    data: () => {
      return [
        {
          input: "Foo",
          expected: "Hi Foo",
        },
        {
          input: "Bar",
          expected: "Hello Bar",
        },
      ]; // Replace with your eval dataset
    },
    task: async (input) => {
      return output(input); 
    },
    scores: [Levenshtein],
  },
);