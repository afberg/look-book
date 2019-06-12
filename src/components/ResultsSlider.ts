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
            display: block;
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
        }
        img {
            object-fit: cover;
            width: 100%;
            max-height: 500px;
        }
        .slider{
            display: flex;
            overflow-x: scroll;
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
            this.scrollToElement(this.shadowRoot.querySelector(`.result:nth-child(${this.active + 1})`));
        }
    }

    render() {
        //Add first few elements to end of array, to create an infinite scroll appearance
        const resultsToShow = this.results.length > 3? [...this.results, ...this.results.slice(0,3)] : this.results; 
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
                                    ${this.imageUrlGenerator(result.isbn, "L")} 360w"
                                sizes="
                                    (max-width: 100px) 50px,
                                    (max-width: 400px) 300px,
                                    (max-width: 600px) 375px"
                                
                            >`: html``}
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