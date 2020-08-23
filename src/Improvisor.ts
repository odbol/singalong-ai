import {Transport} from 'tone';

import MagentaProxy from './MagentaProxy';
import Instruments from './Instruments';

const MAX_TICKS = 800;

export default class Improvisor {

    private magenta = new MagentaProxy();

    private notes = [];
    
    private instruments = new Instruments();

    constructor() {}

    async start() {
        await this.instruments.start();
        await this.magenta.initialize();
    }

    async onNote(midiNote: number) {
        this.notes.push({
            note: midiNote,
            ticks: Transport.ticks
        });

        if (this.notes.length > 2 && this.notes[this.notes.length - 1].ticks - this.notes[0].ticks > MAX_TICKS) {
            const sequence = await this.magenta.continueSequence(this.notes);
            console.log("got sequence", sequence);

            this.notes = [];
        }
    }
}