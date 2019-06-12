import { LitElement, html, css, customElement, property } from 'lit-element';
import "./SearchBar";
import "./ResultsSlider";
import "./CarouselIndicator";
import "./RelativeTime";
import { createSearchFunction as createSearch, parseSearchResponse as parseResponse } from "../services/api";
import { 
    searchBase,
    debounceTime, 
    sliderInterval, 
    timerInterval, 
    maxIndicatorItems,
    loadImagesAheadCount
} from "../config";
import { debounce } from "debounce";
import { createRecognizer } from '../services/speech';
import Book from '../types/book.i';
import microphone from "../assets/microphone.svg";
import stroopwafel from "../assets/stroopwafel.svg";



@customElement('book-search')
export class BookSearch extends LitElement {
    @property({ type: Function, attribute: false }) search = createSearch(searchBase);
    @property({ type: String, attribute: false }) inputValue = "";
    @property({ type: Array, attribute: false }) resultsList: Book[] = [];
    @property({ type: Boolean, attribute: false }) isRecording = false;
    @property({ type: Boolean, attribute: false }) isSearching = false;
    @property({ type: Number, attribute: false }) loadAhead = loadImagesAheadCount;
    @property({ type: Number, attribute: false }) activeResult = 0;
    @property({ type: Number, attribute: false }) sliderInterval: number;
    @property({ type: Number, attribute: false }) lastRetrievedInterval: number;
    @property({ type: Date, attribute: false }) lastRetrieved: Date = new Date();
    @property({ type: Date, attribute: false }) currentTime: Date = new Date();


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
        .search {
            width: 100%;
            background-color:white;
            box-sizing: border-box;
            margin-bottom: 5px;
        }
        button {
            border: 1px solid var(--darkPurple);
            padding: 10px;
            box-sizing: border-box;
            height: 48px;
            width: 48px;
            border-radius: 50%;
            background-color: var(--lightPurple);
            cursor: pointer;
            flex-shrink: 0;
        }
        serach-bar {
            flex-grow: 1;
            margin-bottom: 5px;
            display: block;
        }
        button:hover, button:active{
            background-color: var(--darkPurple);
        }
        button img {
            display: block;
            height: 100%;
            margin:auto;
        }

        button[disabled] {
            background-color: grey;
            border-color: grey;
            cursor: not-allowed;
        }
        .message {
            display: none;
            text-align: center;
            margin: 10px auto;
        }
        .loading {
            width: 80px;
            height: 80px;
            display: block;
            animation: rotate 1s linear;
        }
        .recording {
            display: block;
        }
        carousel-indicator {
            --indicatorColor: var(--lightPurple);
            justify-content: center;
            flex-wrap: wrap;
        }
        relative-time {
            position:fixed;
            bottom: 10px;
            width: calc(100% - 20px);
            max-width: 780px;
            transform: translateY(calc(100% + 15px));
            transition: transform 0.2s ease-in-out;
            display: block;
            height: 50px;
            z-index: 2;
        }
        relative-time.active{
            transform: translateY(0);
        }
        @keyframes rotate {
            from {transform: rotate(0deg)}
            to {transform: rotate(360deg)}
        }
        `;
        
    }

    render() {
        
        return html`
           <div class="search">
                <search-bar 
                    placeholder="Search for a book"
                    @update="${debounce((ev: any) => this.searchUpdated(ev.detail.value), debounceTime)}" 
                    .value="${this.inputValue}">
                    <button @click="${this.startRecording}" ?disabled="${this.isRecording}">
                        <img src="${microphone}">
                    </button>
                </search-bar>
            </div>
            
            
            <results-slider 
                .results="${this.resultsList}" 
                .loadAhead="${this.loadAhead}" 
                .active="${this.activeResult}"
                class="${this.resultsList.length > 0 ? "showing": ""}">
            </results-slider>
            <div class="message ${this.isSearching ? "loading" : this.isRecording ? "recording" : ""} ">
                ${this.isSearching ? html`
                    <img src="${stroopwafel}">
                `: "Recording..."}
            </div>
            <relative-time .earlierDate="${this.lastRetrieved}" .laterDate="${this.currentTime}" class="${this.resultsList.length > 0 ? "active": ""}"></relative-time>
            <carousel-indicator .activeIx="${this.activeResult % maxIndicatorItems}" .count="${Math.min(this.resultsList.length, maxIndicatorItems) }"></carousel-indicator>

            
        `;
    }

    async searchUpdated(searchTerm: string) {
        this.resultsList = [];
        this.isSearching = true;
        const response = await this.search(searchTerm);
        this.resultsList = await parseResponse(response);
        this.activeResult = 0;
        this.isSearching = false;
        this.lastRetrieved = new Date();
        window.clearInterval(this.sliderInterval);
        window.clearInterval(this.lastRetrievedInterval);
        this.sliderInterval = this.createSliderInterval();
        // Regularly updating a class property triggers a re-rendering of the specific element 
        this.lastRetrievedInterval = window.setInterval(() => {
            this.currentTime = new Date();
        }, timerInterval);
    }

    startRecording() {
        this.resultsList = [];
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
        }, sliderInterval);
    }
}