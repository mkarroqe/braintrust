# braintrust-local-backup
This repo supports downloading a Braintrust project to a local directory.

## usage
to run, add your `BRAINTRUST_API_KEY` to your `.env` file and run 

```
npx ts-node download_project.ts <projectName>
```

If `projectName` is not provided, you will be prompted to add one.

## testing
example csv files are in the `local_projects/Explorations` directory; `Explorations` was my mock project name.

`mock-setup` was used to populate my braintrust account with mock data for testing, with the values for `PROJECT_NAME` and `DATASET_NAME` being set in the `.env` file.

```
ts-node mock-setup/init-dataset.ts
npx braintrust eval mock-setup/mock.eval.ts
```

## notes
- The CSVs currently include a few fields that aren't visible in the UI (id, _xact_id, created, project_id, experiment_id/dataset_id).