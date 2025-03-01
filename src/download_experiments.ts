import * as dotenv from 'dotenv'
dotenv.config()

import * as fs from 'fs'
import { ListExperimentsResponse, FetchExperimentResponse } from './experiments';
import { escapeCsvValue } from './utils'

async function listExperiments(projectName: string): Promise<ListExperimentsResponse> {
    return fetch(`https://api.braintrust.dev/v1/experiment?project_name=${projectName}`, {
        headers: {
          "Authorization": `Bearer ${process.env.BRAINTRUST_API_KEY}`
        }
      }).then(res => res.json()).then(res => { return res as ListExperimentsResponse});
}
     
async function fetchExperiment(experimentId: string): Promise<FetchExperimentResponse> {
    return fetch(`https://api.braintrust.dev/v1/experiment/${experimentId}/fetch`, {
        headers: {
          "Authorization": `Bearer ${process.env.BRAINTRUST_API_KEY}`
        }
      }).then(res => res.json()).then(res => { return res as FetchExperimentResponse});
}

function processEvents(events: FetchExperimentResponse['events']) {
    let rootEventsMap = new Map<string, FetchExperimentResponse['events'][number]>();
    let dynamicHeadersSet = new Set<string>();

    events.forEach(event => {
        const rootSpanId = event.root_span_id;
        if (event.is_root) {
            rootEventsMap.set(rootSpanId, { ...event });
            dynamicHeadersSet.add('duration'); 
            dynamicHeadersSet.add('prompt tokens');
            dynamicHeadersSet.add('completion tokens');
            dynamicHeadersSet.add('total tokens');
        } else {
            const spanAttributes = event.span_attributes;
            if (spanAttributes && spanAttributes.type === 'score' && spanAttributes.name && event.scores && event.scores[spanAttributes.name] !== undefined) {
                dynamicHeadersSet.add(spanAttributes.name);
            }
        }
    });

    return { rootEventsMap, dynamicHeadersSet };
}

function generateCsvHeaders(events: FetchExperimentResponse['events'], dynamicHeadersSet: Set<string>, excludedFields: string[]) {
    const staticHeaders = Object.keys(events[0])
        .filter(key => key !== 'span_attributes' && key !== 'scores')
        .filter(key => !excludedFields.includes(key));
    const dynamicHeaders = Array.from(dynamicHeadersSet);
    const headers = staticHeaders.concat(dynamicHeaders);
    return headers.join(',');
}

function calculateDuration(metrics: { start?: number; end?: number }): string {
    if (metrics.start !== undefined && metrics.end !== undefined) {
        return ((metrics.end - metrics.start) / 1000).toFixed(2); // Calculate duration in seconds
    }
    return '';
}

function generateCsvRows(events: FetchExperimentResponse['events'], rootEventsMap: Map<string, FetchExperimentResponse['events'][number]>, dynamicHeaders: string[], staticHeaders: string[]) {
    return Array.from(rootEventsMap.values()).map(rootEvent => {
        const rootSpanId = rootEvent.root_span_id;
        const dynamicValues: { [key: string]: string | number } = {};

        // Calculate duration and add other metrics
        if (rootEvent.metrics) {
            dynamicValues['duration'] = calculateDuration(rootEvent.metrics);
            dynamicValues['prompt tokens'] = rootEvent.metrics.prompt_tokens !== undefined ? rootEvent.metrics.prompt_tokens : '';
            dynamicValues['completion tokens'] = rootEvent.metrics.completion_tokens !== undefined ? rootEvent.metrics.completion_tokens : '';
            dynamicValues['total tokens'] = rootEvent.metrics.tokens !== undefined ? rootEvent.metrics.tokens : '';
        }

        events.forEach(event => {
            if (!event.is_root && event.root_span_id === rootSpanId) {
                const spanAttributes = event.span_attributes;
                if (spanAttributes && spanAttributes.type === 'score' && spanAttributes.name && event.scores && event.scores[spanAttributes.name] !== undefined) {
                    dynamicValues[spanAttributes.name] = event.scores[spanAttributes.name];
                }
            }
        });

        const staticValues = staticHeaders.map(key => {
            const value = rootEvent[key as keyof typeof rootEvent];
            return value !== null && value !== undefined ? escapeCsvValue(value) : '';
        });

        const dynamicValuesArray = dynamicHeaders.map(header => {
            const value = dynamicValues[header];
            return value !== undefined ? escapeCsvValue(value) : '';
        });

        return [...staticValues, ...dynamicValuesArray].join(',');
    }).join('\n');
}

export async function downloadExperimentsToCsv(projectName: string, destDir: string): Promise<Boolean> {
    const experimentsList = await listExperiments(projectName);
    if (experimentsList.objects.length == 0) { 
        console.error("No experiments found for " + projectName + ".");
        return false;
    }

    // NOTE: assumption
    const excludedFields = ['_xact_id', 'created', 'project_id', 'experiment_id', 'span_id', 'metrics', 'context', 'span_parents', 'root_span_id', 'is_root', 'origin'];

    console.log("Downloading experiments...")
    for (const experiment of experimentsList.objects) {
        const fetchedExperiment = await fetchExperiment(experiment.id);

        // Check if experiment contains no events
        if (!fetchedExperiment.events || fetchedExperiment.events.length === 0) {
            console.warn("\tSkipped", experiment.name + ": no events found.");
            break;
        }

        const filename = `${destDir}/experiment_${experiment.name}.csv`;

        const { rootEventsMap, dynamicHeadersSet } = processEvents(fetchedExperiment.events);
        const csvHeaders = generateCsvHeaders(fetchedExperiment.events, dynamicHeadersSet, excludedFields);

        const staticHeaders = csvHeaders.split(',').filter(header => dynamicHeadersSet.has(header) === false);
        const dynamicHeaders = Array.from(dynamicHeadersSet);
        const csvRows = generateCsvRows(fetchedExperiment.events, rootEventsMap, dynamicHeaders, staticHeaders);

        const csvContent = `${csvHeaders}\n${csvRows}`;
        fs.writeFileSync(filename, csvContent);

        console.log("\tSuccessfully downloaded", experiment.name + ".");
    }

    return true;
}