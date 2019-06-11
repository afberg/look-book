import { LitElement, html, css, customElement, property } from 'lit-element';
import "./SearchBar";
import "./ResultsSlider";
import { createSearchFunction as createSearch, parseSearchResponse as parseResponse } from "../services/api";
import { searchBase, debounceTime } from "../config";
import { debounce } from "debounce";
import { createRecognizer } from '../services/speech';
import Book from '../types/book.i';


@customElement('book-search')
export class BookSearch extends LitElement {
    @property({ type: Function, attribute: false }) search = createSearch(searchBase);
    @property({ type: String, attribute: false }) inputValue = "";
    @property({ type: Array, attribute: false }) resultsList: Book[] = [];
    @property({ type: Boolean, attribute: false }) isRecording = false;
    @property({ type: Boolean, attribute: false }) isSearching = false;
    @property({ type: Number, attribute: false }) maxResults = 5;

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
        `;
        
    }

    render() {
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
            <results-slider .results="${this.resultsList}" .maxResults="${this.maxResults}"></results-slider>
        `;
    }

    async searchUpdated(searchTerm: string) {
        const response = await this.search(searchTerm);
        this.resultsList = await parseResponse(response);
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
}