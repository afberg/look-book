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
            min-width: 100vw;
            max-width: 100vw;
            max-height: 600px;
            min-height: 500px;
            background-size: cover;
            background-position: center;
        }
        img {
            object-fit: cover;
        }
        .slider{
            display: inline-flex;
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
            if(this.active === 0){
                this.shadowRoot.querySelector(".slider").scrollLeft = 0;
            }
            console.log("scrolling to ", this.active + 1);
            this.scrollToElement(this.shadowRoot.querySelector(`.result:nth-child(${this.active + 1})`));
            
        }
    }

    render() {
        //Add first element to end of array
        const resultsToShow = this.results.length > 0 ? [...this.results, this.results[0]] : this.results; 
        return html`
            <div class="results" >
                <div class="slider" style="animation-duration: ${this.results.length}s;">
                    ${resultsToShow.map((result, ix) => html`
                        <div class="result" style="background-image: url(${noCover});" id="${ix === 0 ? "first-book": ""}">
                        <!-- Only load the image if it's within threshold -->
                            ${ix < this.active  + this.loadAhead ? html`<img  
                                srcset="
                                    ${this.imageUrlGenerator(result.isbn, "S")} 43w,
                                    ${this.imageUrlGenerator(result.isbn, "M")} 180w,
                                    ${this.imageUrlGenerator(result.isbn, "L")} 360w"
                                sizes="
                                    (max-width: 200px) 100px,
                                    (max-width: 400px) 300px,
                                    (max-width: 600px) 360px"
                                
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