# braintrust-local-backup
This repo supports downloading a Braintrust project to a local directory.

## Usage
To run, add your `BRAINTRUST_API_KEY` to your `.env` file and run: 

```
npx ts-node download_project.ts <PROJECT NAME>
```
> If `<PROJECT NAME>` is not provided, you will be prompted to add one.

A new directory of `.csv` files will be generated with the following naming conventions:
- `<PROJECT NAME>_YYYYMMDDHHMMSS`/
  - `dataset_<DATASET NAME>.csv`
  - `experiment_<EXPERIMENT NAME>.csv`

## Testing/Demo
Example `csv` files are in the `local_projects/` directory.

#### Example: `canned-spam`
The `canned-spam` project was loosely inspired by the [Spam Classifier Cookbook](https://www.braintrust.dev/docs/cookbook/recipes/SpamClassifier#importing-a-dataset). 
  - [Dataset](https://github.com/mkarroqe/braintrust/blob/main/local_projects/canned-spam-20250227081510/dataset_ex(spam)ples.csv)
  - [Experiment](https://github.com/mkarroqe/braintrust/blob/main/local_projects/canned-spam-20250227081510/experiment_main-1740644012.csv)

#### Example: `Project-e34fd59c`
The `Project-e34fd59c` project was initialized with mock data from the [Get Started Tutorial](https://www.braintrust.dev/docs/start/eval-sdk).
  - [Dataset 1](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/dataset_Test-Dataset-ajhsgdf8.csv)
  - [Dataset 2](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/dataset_Test-Dataset-e34fd59c.csv)
  - [Experiment 1](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/experiment_main-1740417406.csv) - 1 scorer
  - [Experiment 2](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/experiment_main-1740417579.csv) - 1 scorer
  - [Experiment 3](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/experiment_main-1740545492.csv) - 1 scorer, includes error messages
  - [Experiment 4](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/experiment_main-1740545536.csv) - 2 scorers

## Future Considerations:
- ordering/filtering columns
