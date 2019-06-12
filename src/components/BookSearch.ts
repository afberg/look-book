import { LitElement, html, css, customElement, property } from 'lit-element';
import "./SearchBar";
import "./ResultsSlider";
import { createSearchFunction as createSearch, parseSearchResponse as parseResponse } from "../services/api";
import { searchBase, debounceTime } from "../config";
import { debounce } from "debounce";
import { createRecognizer } from '../services/speech';
import Book from '../types/book.i';
import { getRelativeTimeValue, getRelativeTimeUnit } from '../services/date';



@customElement('book-search')
export class BookSearch extends LitElement {
    @property({ type: Function, attribute: false }) search = createSearch(searchBase);
    @property({ type: String, attribute: false }) inputValue = "";
    @property({ type: Array, attribute: false }) resultsList: Book[] = [];
    @property({ type: Boolean, attribute: false }) isRecording = false;
    @property({ type: Boolean, attribute: false }) isSearching = false;
    @property({ type: Number, attribute: false }) loadAhead = 5;
    @property({ type: Number, attribute: false }) activeResult = 0;
    @property({ type: Number, attribute: false }) sliderInterval: number;
    @property({ type: Number, attribute: false }) lastRetrievedInterval: number;
    @property({ type: Date, attribute: false }) lastRetrieved: Date = new Date();
    @property({ type: Date, attribute: false }) currentTime: Date = new Date();
    //@ts-ignore: Relativetimeformat is a new property that ts doesn't know about
    @property({ type: Function, attribute: false }) rtf = new Intl.RelativeTimeFormat(navigator.language, { style: 'long' });

    constructor(){
        super();
        //Add event listeners to stop slider when page is in the background
        window.onblur = () => window.clearInterval(this.sliderInterval);
        window.onfocus = () => {
            if(this.resultsList.length > 0) {
                window.clearInterval(this.sliderInterval)
                this.sliderInterval = this.createSliderInterval();
            }
                
        }
    }
    static get styles() {
        return css`
        .search-container {
            display: flex;
            align-items: flex-end;
            width: 100%;
        }
        search-bar {
            flex-grow: 1;
        }
        button {
            margin-left: 10px;
            height: 52px;
            width: 52px;
            border-radius: 50%;
        }
        results-slider{
            display: none;
        }
        results-slider.showing{
            display: block;
        }
        `;
        
    }

    render() {
        const timeDiff = this.currentTime.getTime() - this.lastRetrieved.getTime();
        return html`
            <div class="search-container">
                <search-bar 
                    placeholder="Search for a book" 
                    label="Book Title" 
                    @update="${debounce((ev: any) => this.searchUpdated(ev.detail.value), debounceTime)}" 
                    .value="${this.inputValue}">
                </search-bar>
                <button @click="${this.startRecording}" ?disabled="${this.isRecording}">Record</button>
            </div>
            ${
                // We only render the last retrieved div when results have been retrieved
                timeDiff > 0 ? html`
                <div class="last-retrieved">
                    ${
                        this.rtf.format(
                            -getRelativeTimeValue(timeDiff),
                            getRelativeTimeUnit(timeDiff))
                    }
                </div>` : html``
            }
            
            <results-slider 
                .results="${this.resultsList}" 
                .loadAhead="${this.loadAhead}" 
                .active="${this.activeResult}"
                class="${this.resultsList.length > 0 ? "showing": ""}"></results-slider>
        `;
    }

    async searchUpdated(searchTerm: string) {
        const response = await this.search(searchTerm);
        this.resultsList = await parseResponse(response);
        this.activeResult = 0;
        this.lastRetrieved = new Date();
        window.clearInterval(this.sliderInterval);
        window.clearInterval(this.lastRetrievedInterval);
        this.sliderInterval = this.createSliderInterval();
        // Regularly updating a class property triggers a re-rendering of the specific element
        this.lastRetrievedInterval = window.setInterval(() => {
            this.currentTime = new Date();
        }, 5000);
    }

    startRecording(ev: Event) {
        const recognizer = createRecognizer(
            () => {
                this.inputValue = "";
                this.isRecording = true;
            },
            () => this.isRecording = false,
            (event: any) => {
                // Automatically uses the latest result with the highest confidence
                this.inputValue = event.results[event.results.length - 1 ][0].transcript;
                this.searchUpdated(this.inputValue);
            }
        );
        recognizer.start();
    }

    createSliderInterval(){
        return window.setInterval(() => {
            this.activeResult = ((this.activeResult + 1) % (this.resultsList.length + 1));
        }, 2000);
    }
}