import { LitElement, html, css, customElement, property } from 'lit-element';
import "./SearchBar";
import "./ResultsSlider";
import { createSearchFunction as createSearch, parseSearchResponse as parseResponse } from "../services/api";
import { searchBase, debounceTime, sliderInterval, timerInterval } from "../config";
import { debounce } from "debounce";
import { createRecognizer } from '../services/speech';
import Book from '../types/book.i';
import { getRelativeTimeValue, getRelativeTimeUnit } from '../services/date';
import microphone from "../assets/microphone.svg";



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
            border: 1px solid #ddd;
            border-radius: 26px;
            overflow:hidden;
            box-sizing: border-box;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .search-container:focus-within{
            box-shadow: 0px 0px 5px 0px var(--lightPurple);
        }
        search-bar {
            flex-grow: 1;
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
        .last-retrieved {
            background-color: white;
            box-shadow: 0px 0px 5px 0px var(--lightPurple);
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;
            bottom: 10px;
            width: calc(100% - 20px);
            max-width: 780px;
            margin: 0 10px;
            height: 50px;
            border-radius: 25px;
            justify-content: space-around;
            margin: 0 auto;
            transform: translateY(calc(100% + 15px));
            transition: transform 0.2s ease-in-out;
        }
        .last-retrieved.active{
            transform: translateY(0);
        }
        .last-retrieved::before{
            content: "Books fetched";
            display: block;
        }
        `;
        
    }

    render() {
        const timeDiff = this.currentTime.getTime() - this.lastRetrieved.getTime();
        const shouldShowRelativeTime = timeDiff > 0 && this.resultsList.length > 0;
        return html`
            <div class="search-container">
                <search-bar 
                    placeholder="Search for a book" 
                    label="Book Title" 
                    @update="${debounce((ev: any) => this.searchUpdated(ev.detail.value), debounceTime)}" 
                    .value="${this.inputValue}">
                </search-bar>
                <button @click="${this.startRecording}" ?disabled="${this.isRecording}">
                    <img src="${microphone}">
                </button>
            </div>
            
            <results-slider 
                .results="${this.resultsList}" 
                .loadAhead="${this.loadAhead}" 
                .active="${this.activeResult}"
                class="${this.resultsList.length > 0 ? "showing": ""}">
            </results-slider>

            <div class="last-retrieved ${shouldShowRelativeTime ? "active": ""}" >
                ${
                    shouldShowRelativeTime ? 
                        this.rtf.format(
                            -getRelativeTimeValue(timeDiff),
                            getRelativeTimeUnit(timeDiff)
                        ) : ""
                }
            </div>
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
        }, timerInterval);
    }

    startRecording() {
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