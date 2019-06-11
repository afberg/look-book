import Book from "../types/book.i";

export function createSearchFunction(url: string): (query: string) => Promise<Response> {
    return async (query) => fetch(buildSearchUrl(url, query));
}

export function buildSearchUrl(base: string, searchValue: string): string {
    return `${base}?q=${searchValue.toLowerCase().replace(/ /g, "+")}`;
}

export function createImageUrlBuilder(base: string): (isbn: string, size: string) => string {
    return (isbn, size) => `${base}${isbn}-${size.toUpperCase()}.jpg`;
}

export async function parseSearchResponse(response: Response): Promise<Book[]> {
    return (await response.json()).docs.map( (book: any) => ({
        isbn: book.isbn ? book.isbn[0] : undefined,
        author: book.author_name ? book.author_name[0] : "John Doe",
        title: book.title || "Untitled"
    }));
}