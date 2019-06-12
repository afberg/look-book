import {LitElement, html, css, customElement, property} from 'lit-element';
import { getRelativeTimeValue, getRelativeTimeUnit } from '../services/date';

@customElement('relative-time')
export class RelativeTime extends LitElement {
    @property({ type: Date }) earlierDate = new Date();
    @property({ type: Date }) laterDate = new Date();
    //@ts-ignore: Relativetimeformat is a new property that ts doesn't know about
    @property({ type: Function, attribute: false }) rtf = new Intl.RelativeTimeFormat(navigator.language, { style: 'long' });

    static get styles() {
        return css`
        .last-retrieved {
            background-color: white;
            box-shadow: 0px 0px 5px 0px var(--lightPurple);
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;
            height: 100%;
            border-radius: 25px;
            justify-content: space-around;
            width: 100%;
        }
        .last-retrieved::before{
            content: "Books fetched";
            display: block;
        }
        `;
        
    }

    render() {
        const timeDiff = this.laterDate.getTime() - this.earlierDate.getTime();
        return html`
         <div class="last-retrieved ${timeDiff > 0 ? "active": ""}" >
                ${
                    timeDiff > 0 ? 
                        this.rtf.format(
                            -getRelativeTimeValue(timeDiff),
                            getRelativeTimeUnit(timeDiff)
                        ) : ""
                }
            </div>
        `;
    }

}