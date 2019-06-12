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
            display: block;
            padding: 10px;
            font-size: 24px;
            width: 100%;
            border: none;
            box-sizing: border-box;
            outline-style: none;
            color: inherit;
        }
        .search-container {
            display: flex;
            align-items: flex-end;
            border: 1px solid #ddd;
            border-radius: 26px;
            overflow:hidden;
            box-sizing: border-box;
        }
        .search-container:focus-within{
            box-shadow: 0px 0px 5px 0px var(--lightPurple);
        }
        `;
        
    }

    render() {
        return html`
         <div class="search-container">
            <!-- searchChanged is wrapped in an arrow function to ensure correct context -->
            <input 
                id="${this.inputId}" 
                @input="${(ev: Event) => this.searchChanged((<HTMLInputElement>ev.target).value)}" 
                placeholder="${this.placeholder}"
                .value="${this.value}"/>
                <slot></slot>
        </div>
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