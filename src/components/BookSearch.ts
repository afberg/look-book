import { LitElement, html, css, customElement, property } from 'lit-element';
import "./SearchBar";
import createSearch from "../services/Search";
import { searchBase } from "../config";


@customElement('book-search')
export class BookSearch extends LitElement {
    @property({ type: Function, attribute: false }) search = createSearch(searchBase);
    static get styles() {
        return css`
        `;
        
    }

    render() {
        return html`
            <search-bar placeholder="Search for a book" label="Book Title" @update="${this.searchUpdated}"></search-bar>
        `;
    }

    async searchUpdated(event) {
        const response = await this.search(event.detail.value);
        console.log(await response.json());
    }
}