import {LitElement, html, css, customElement, property} from 'lit-element';

@customElement('search-bar')
export class SearchBar extends LitElement {
    @property({ type: String, attribute: false }) inputId = "input-" + (Math.random()*1000%1).toString();
    @property({ type: String}) label = "";
    @property({ type: String}) placeholder = "";
    @property({ type: String}) value = "";

    static get styles() {
        return css`
        input {
            displauy: block;
            padding: 10px;
            font-size: 24px;
            width: 100%;
            border: none;
            box-sizing: border-box;
            outline-style: none;
        }
        `;
        
    }

    render() {
        return html`
            <!-- searchChanged is wrapped in an arrow function to ensure correct context -->
            <input 
                id="${this.inputId}" 
                @input="${(ev: Event) => this.searchChanged((<HTMLInputElement>ev.target).value)}" 
                placeholder="${this.placeholder}"
                .value="${this.value}"/>
        `;
    }

    searchChanged(value: string){
        this.dispatchEvent(new CustomEvent('update', {
            detail: {
              value
            }
        }));
    }
}