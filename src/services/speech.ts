import { newWindow } from "../types/newWindow";

export function createRecognizer(
        onstart: (event: any) => any,
        onend: (event: any) => any,
        onresult: (event: any) => any): { start: () => void, onresult: () => any } {
    const { webkitSpeechRecognition }: newWindow = <newWindow>window;
    const recognizer = new webkitSpeechRecognition();
    recognizer.onstart = onstart;
    recognizer.onend = onend;
    recognizer.onresult = onresult;
    return recognizer;
}