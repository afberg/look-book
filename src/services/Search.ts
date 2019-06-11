

export default function createSearchFunction(url: string): (query: string) => Promise<any> {
    return async (query) => fetch(buildSearchUrl(url, query));
}

export function buildSearchUrl(base: string, searchValue: string): string {
    return `${base}?q=${searchValue.toLowerCase().replace(/ /g, "+")}`;
}