# braintrust-local-backup
This repo supports downloading a Braintrust project to a local directory.

## usage
To run, add your `BRAINTRUST_API_KEY` to your `.env` file and run: 

```
npx ts-node download_project.ts <PROJECT NAME>
```
> If `<PROJECT NAME>` is not provided, you will be prompted to add one.

A new directory of `.csv` files will be generated with the following naming conventions:
- `<PROJECT NAME>_YYYYMMDDHHMMSS`/
  - `dataset_<DATASET NAME>.csv`
  - `experiment_<EXPERIMENT NAME>.csv`

## testing/demo
Example `csv` files are in the `local_projects/` directory.

#### Example: `canned-spam`
  - The `canned-spam` project was loosely inspired by the [Spam Classifier Cookbook](https://www.braintrust.dev/docs/cookbook/recipes/SpamClassifier#importing-a-dataset). 

  - [Dataset]()
  - [Experiment]()

#### Example: `Project-e34fd59c`
  - The `Project-e34fd59c` project was initialized with mock data from the [Get Started Tutorial](https://www.braintrust.dev/docs/start/eval-sdk).
  - [`experiment_main-1740545492.csv`](local_project/Project-e34fd59c-2-25-227075115/experiment_main-1740545492.csv) includes error messages