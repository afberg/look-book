import { LitElement, html, css, customElement, property } from 'lit-element';
import "./SearchBar";
import createSearch from "../services/Search";
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
        console.log(await response.json());
    }
}