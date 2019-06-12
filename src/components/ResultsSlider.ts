import { LitElement, html, css, customElement, property} from 'lit-element';
import Book from '../types/book.i';
import { imageBase } from "../config";
import { createImageUrlBuilder } from '../services/api';
import noCover from "../assets/noCover.jpg";

@customElement('results-slider')
export class ResultsSlider extends LitElement {

    @property({ type: Array}) results: Book[] = [];
    @property({ type: Number}) active = 0;
    @property({ type: Number}) loadAhead = 5;
    @property({ type: Number}) lastLoaded = this.active;
    @property({ type: Function}) imageUrlGenerator = createImageUrlBuilder(imageBase);

    static get styles() {
        return css`
        .result{
            position: relative;
            display: flex;
            scroll-snap-align: start;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            box-sizing: border-box;
            width: calc(100vw - 20px);
            flex-shrink: 0;
            max-width: 375px;
            background-size: cover;
            background-position: center;
            max-height: calc(100vh - 150px);
            overflow: hidden;
        }

        img {
            object-fit: cover;
            width: 100%;
            max-height: 500px;
        }
        .slider{
            display: flex;
            /* user scroll is disabled to not break auto scroll*/
            /*overflow-x: scroll;*/
            overflow-x: hidden;
            scroll-snap-type: x mandatory;
            width: 100%;
        }
        .results{
            position: relative;
            width: 100%;
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
        const activeProp = changedProperties.get("active")
        // Zero evaluates to false, so an extra check is needed
        if(activeProp || activeProp === 0) {

            //Resets the slider to the original position
            if(this.active === 0)
                this.shadowRoot.querySelector(".slider").scrollLeft = 0;

            //This variable makes sure already loaded images are not rerendered after slider loop
            this.lastLoaded = Math.max(this.active + this.loadAhead, this.lastLoaded);
            //The nth-child selector starts at 1, not 0
            this.scrollToElement(this.shadowRoot.querySelector(`.result:nth-child(${this.active + 1})`));
        }
    }

    render() {
        //Add first few elements to end of array, to create an infinite scroll appearance
        const resultsToShow = this.results.length > 1? [...this.results, this.results[0], this.results[1]] : this.results;
        return html`
            <div class="results" >
                <div class="slider">
                    ${resultsToShow.map((result, ix) => html`
                        <div class="result" style="background-image: url(${noCover});">
                            <!-- Only load the image if it's within threshold -->
                            ${ix < this.active  + this.loadAhead  || ix <= this.lastLoaded ? html`<img  
                                srcset="
                                    ${this.imageUrlGenerator(result.isbn, "S")} 43w,
                                    ${this.imageUrlGenerator(result.isbn, "M")} 180w,
                                    ${this.imageUrlGenerator(result.isbn, "L")} 600w"
                                sizes="(min-width: 600px) 559px, (min-width: 400px) 200px, (min-width: 200px) 42px">`: ""}
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

    scrollToElement(elem: HTMLElement) {
        elem.scrollIntoView({ behavior:"smooth", block: "end", inline: "start" });
    }

}