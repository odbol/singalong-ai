import {Transport} from 'tone';

import {Note} from './magenta-proxy/Note';

import MagentaProxy from './MagentaProxy';
import Instruments from './Instruments';


// You must change both of these at the same time.
const STEP_AS_SUBDIVISION = '8n';
const STEPS_PER_BEAT = 2; // Assuming 1 beat = '4n' (quarter note)

const MAX_STEPS = 16 / STEPS_PER_BEAT;

function secondsToSteps(seconds) {
    const beatsPerSecond = Transport.bpm.value / 60;
    const numBeats = seconds / beatsPerSecond;
    return Math.round(STEPS_PER_BEAT * numBeats);
}

export default class Improvisor {

    private magenta = new MagentaProxy();

    private notes: Note[] = [];
    
    private instruments = new Instruments();

    constructor() {}

    async start() {
        await this.instruments.start();
        await this.magenta.initialize();
    }

    async onNote(midiNote: number) {
        const currentStep = secondsToSteps(Transport.nextSubdivision(STEP_AS_SUBDIVISION));
        const quantizedStartStep = this.notes.length > 0 ? currentStep - this.notes[0].quantizedStartStep : 0;
        const quantizedEndStep = quantizedStartStep + STEPS_PER_BEAT;
        this.notes.push({
            pitch: midiNote,
            quantizedStartStep,
            quantizedEndStep
        });

        if (this.notes.length > 2 && quantizedStartStep > MAX_STEPS) {
            const sequence = await this.magenta.continueSequence(this.notes);
            console.log("got sequence", sequence);

            this.notes = [];
        }
    }
}