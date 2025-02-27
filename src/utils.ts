export function escapeCsvValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
    }
    const stringValue = value.toString();
    if (stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes(',')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}