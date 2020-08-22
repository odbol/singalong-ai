import {MusicRNN} from '@magenta/music/es6/music_rnn';
import {Transport} from 'tone';

import Instruments from './Instruments';

  /*
  let melodyRnn = new music_rnn.MusicRNN( 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
  let melodyRnnLoaded = melodyRnn.initialize()
  
  document.getElementById('generate-melody').onclick = async () => {
    await melodyRnnLoaded;
    
    let seed = {
      notes: [
        {pitch: Tone.Frequency('C#3').toMidi(), quantizedStartStep: 0, quantizedEndStep: 4}
      ],
      totalQuantizedSteps: 4,
      quantizationInfo: { stepsPerQuarter: 4}
    };
    let steps = 28;
    let temperature = 1.2;
    let chordProgression = ['C#m7'];
    
    let result = await melodyRnn.continueSequence(seed, steps, temperature, chordProgression);
    
    let combined = core.sequences.concatenate([seed, result]);
    
    sequencer.matrix.populate.all([0]);
    for (let note of combined.notes) {
      let column = note.quantizedStartStep;
      let noteName = Tone.Frequency(note.pitch, 'midi').toNote();
      let row = sequencerRows.indexOf(noteName);
      if (row >= 0) {
        sequencer.matrix.set.cell(column, row, 1);
      }
    }
    console.log(combined);
  }
  */
export default class Improvisor {

    private rnn = new MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');

    private notes = [];
    
    private instruments = new Instruments();

    constructor() {}

    async start() {
        await this.instruments.start();
        await this.rnn.initialize();
    }

    onNote(midiNote: number) {
        this.notes.push({
            note: Number,
            tick: Transport.ticks
        })
    }
}