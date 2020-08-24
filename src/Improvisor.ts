import {Transport} from 'tone';

import {Note} from './magenta-proxy/Note';

import MagentaProxy from './MagentaProxy';
import Instruments from './Instruments';
import {MAX_STEPS} from './Timeline';

export default class Improvisor {

    private magenta = new MagentaProxy();

    private notes: Note[] = [];
    
    private instruments = new Instruments();

    constructor() {}

    async start() {
        await this.instruments.start();
        await this.magenta.initialize();
    }

    async onNote(quantizedNote: Note) {
        const quantizedStartStep = this.notes.length > 0 ? quantizedNote.quantizedStartStep - this.notes[0].quantizedStartStep : 0;

        this.notes.push({
            quantizedStartStep: quantizedStartStep,
            quantizedEndStep: quantizedStartStep + (quantizedNote.quantizedEndStep - quantizedNote.quantizedStartStep),
            ...quantizedNote
        });

        if (this.notes.length > 2 && quantizedNote.quantizedStartStep > MAX_STEPS) {
            const sequence = await this.magenta.continueSequence(this.notes);
            console.log("got sequence", sequence);

            this.notes = [];
        }
    }
}