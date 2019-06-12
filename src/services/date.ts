const second = 1000;
const minute = second * 60;
const quarter = minute * 15;
const hour = quarter * 4;
const day = hour * 24;

export function getRelativeTimeUnit(diff: number) {
    if (diff < minute)
        return "second";
    if(diff < quarter)
        return "minute";
    if(diff < hour)
        return "quarter";
    if(diff < day)
        return "hour";
    else
        return "day";
}

export function getRelativeTimeValue(diff: number) {
    if (diff < minute)
        return Math.floor(diff / second);
    if(diff < quarter)
        return Math.floor(diff / minute);
    if(diff < hour)
        return Math.floor(diff / quarter);
    if(diff < day)
        return Math.floor(diff / hour);
    else
        return Math.floor(diff / day);
}