import {LitElement, html, css, customElement, property} from 'lit-element';

@customElement('search-bar')
export class SearchBar extends LitElement {
    @property({ type: String, attribute: false }) inputId = "input-" + (Math.random()*1000%1).toString();
    @property({ type: String}) label = "";
    @property({ type: String}) placeholder = "";
    @property({ type: String}) value = "";

    static get styles() {
        return css`
        label, input {
            display: block;
        }
        label {
            font-size: 21px;

        }
        input {
            padding: 10px;
            font-size: 24px;
            width: 100%;
            border-bottom: 2px solid #ddd;
            border-radius: 10px;
            box-sizing: border-box;
        }
        `;
        
    }

    render() {
        return html`
            <label for="${this.inputId}">${this.label}</label>
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