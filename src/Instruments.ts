import {start, Transport} from 'tone';

export default class Instruments {

    //onBeat = new Subject();

    constructor() {
        Transport.bpm.value = 120;

        // new Tone.Loop((time) => {
        //     Tone.Draw.schedule(() => onBeat.next(), time);
        //   }, '8n').start();
    }

    async start() {
        await start();
        Transport.start();
    }

    stop() {
        Transport.stop();
    }
}