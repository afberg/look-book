import "./SearchBar";
import {LitElement, html, css, customElement} from 'lit-element';

@customElement('book-search')
export class BookSearch extends LitElement {

    static get styles() {
        return css`
        `;
        
    }

    render() {
        return html`
            <search-bar placeholder="Search for a book" label="Book Title"></search-bar>
        `;
    }
}