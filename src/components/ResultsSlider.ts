import { LitElement, html, css, customElement, property} from 'lit-element';
import Book from '../types/book.i';
import { imageBase } from "../config";
import { createImageUrlBuilder } from '../services/api';

@customElement('results-slider')
export class ResultsSlider extends LitElement {

    @property({ type: Array}) results: Book[] = [];
    @property({ type: Number}) active = 0;
    @property({ type: Number}) maxResults = 5;
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
            min-width: 400px;
            max-width: 400px;
            max-height: 600px;
        }
        @media(max-width: 400px) {
            .result {
                min-width: 300px;
                max-width: 300px;
            }
        }

        @media(max-width: 300px) {
            .result {
                min-width: 100px;
                max-width: 100px;
            }
        }
        img {
            object-fit: contain;
            max-width: 100%;
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
        const resultsToShow = this.results.slice(Math.max(this.active - this.maxResults, 0), this.active + this.maxResults);
        console.log(resultsToShow);

        return html`
            <div class="results">
                <!-- TODO: implement navigation buttons so this works for desktops etc -->
                <div class="slider">
                    ${resultsToShow.map(result => html`
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