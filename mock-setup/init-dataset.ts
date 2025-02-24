import { initDataset } from "braintrust";
 
async function main() {
  const dataset = initDataset("Explorations", { dataset: "Explorations" });
  for (let i = 0; i < 10; i++) {
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