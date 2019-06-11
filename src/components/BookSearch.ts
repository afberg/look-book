import { LitElement, html, css, customElement, property } from 'lit-element';
import "./SearchBar";
import { createSearchFunction as createSearch, parseSearchResponse as parseResponse } from "../services/search";
import { searchBase, debounceTime } from "../config";
import { debounce } from "debounce";


@customElement('book-search')
export class BookSearch extends LitElement {
    @property({ type: Function, attribute: false }) search = createSearch(searchBase);

    static get styles() {
        return css`
        `;
        
    }

    render() {
        return html`
            <search-bar placeholder="Search for a book" label="Book Title" @update="${debounce(this.searchUpdated, debounceTime)}"></search-bar>
        `;
    }

    async searchUpdated(event: any) {
        const response = await this.search(event.detail.value);
        const parsed = await parseResponse(response);
        console.log(parsed);
    }
}