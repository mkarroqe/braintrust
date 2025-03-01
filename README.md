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

### Example: `canned-spam`
The `canned-spam` project was loosely inspired by the [Spam Classifier Cookbook](https://www.braintrust.dev/docs/cookbook/recipes/SpamClassifier#importing-a-dataset).
  - Datasets:
    > `fake and empty` is an empty dataset.
    <img width="1063" alt="image" src="https://github.com/user-attachments/assets/82d5255c-724b-4c05-b2f3-6d201fadd215" />
    
  - Experiments:
    > `main-1740644077` contains no events.
    <img width="1121" alt="image" src="https://github.com/user-attachments/assets/2d4faa6f-8021-417a-a857-a64fd680fe70" />
  
  - Terminal output:
    ```
    Successfully downloaded main-1740784163 to local_projects/canned-spam-20250228235621/experiment_main-1740784163.csv.
    Successfully downloaded main-1740783928 to local_projects/canned-spam-20250228235621/experiment_main-1740783928.csv.
    Experiment main-1740644077  contains no events: Skipping.
    Dataset fake and empty  is empty: Skipping.
    Successfully downloaded ex(spam)ples to local_projects/canned-spam-20250228235621/dataset_ex(spam)ples.csv.
    ```

  - [Dataset](https://github.com/mkarroqe/braintrust/blob/main/local_projects/canned-spam-20250227081510/dataset_ex(spam)ples.csv)
  - [Experiment](https://github.com/mkarroqe/braintrust/blob/main/local_projects/canned-spam-20250227081510/experiment_main-1740644012.csv)
    
### Example: `Project-e34fd59c`
The `Project-e34fd59c` project was initialized with mock data from the [Get Started Tutorial](https://www.braintrust.dev/docs/start/eval-sdk).
  - [Dataset 1](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/dataset_Test-Dataset-ajhsgdf8.csv)
  - [Dataset 2](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/dataset_Test-Dataset-e34fd59c.csv)
  - [Experiment 1](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/experiment_main-1740417406.csv) - 1 scorer
  - [Experiment 2](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/experiment_main-1740417579.csv) - 1 scorer
  - [Experiment 3](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/experiment_main-1740545492.csv) - 1 scorer, includes error messages
  - [Experiment 4](https://github.com/mkarroqe/braintrust/blob/main/local_projects/Project-e34fd59c-20250227075115/experiment_main-1740545536.csv) - 2 scorers

## Future Considerations:
- ordering/filtering columns
