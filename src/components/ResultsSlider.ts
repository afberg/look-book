import { LitElement, html, css, customElement, property} from 'lit-element';
import Book from '../types/book.i';
import { imageBase } from "../config";
import { createImageUrlBuilder } from '../services/api';

@customElement('results-slider')
export class ResultsSlider extends LitElement {

    @property({ type: Array}) results: Book[] = [];
    @property({ type: Number}) active = 0;
    @property({ type: Function}) imageUrlGenerator = createImageUrlBuilder(imageBase);

    static get styles() {
        return css`
        .result{
            position: relative;
            scroll-snap-align: start;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            box-sizing: border-box;
            width: 400px;
            max-height: 600px;
        }
        img {
            object-fit: contain;
        }
        .slider{
            width: 100%;
            scroll-snap-type: x mandatory;
            overflow-x: scroll;
            display: flex;
        }
        .results{
            position: relative;
        }
        .info{
            display: flex;
            flex-direction:column;
            align-items: center;
            text-align: center;
        }
        `;
        
    }
    updated(changedProperties: any) {
        //Force indicator back to zero when new results load
        if(changedProperties.results) {
            this.active = 0;
        }
    }

    render() {
        return html`
            <div class="results">
                <!-- TODO: implement navigation buttons so this works for desktops etc -->
                <div class="slider">
                    ${this.results.map(result => html`
                    <div class="result">
                            <img  srcset="
                                    ${this.imageUrlGenerator(result.isbn, "S")} 43w,
                                    ${this.imageUrlGenerator(result.isbn, "M")} 180w,
                                    ${this.imageUrlGenerator(result.isbn, "L")} 360w,
                                    "
                                sizes="
                                (max-width: 200px) 100px,
                                (max-width: 400px) 300px,
                                (max-width: 600px) 360px
                                "
                            >
                            <div class="info">
                                <div class="title">${result.title}</div>
                                <div class="author">${result.author}</div>
                            </div>
                            
                    </div>
                `)}
            </div>
        </div>
        `;
    }

}