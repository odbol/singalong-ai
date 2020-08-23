function sendMessage(msg) {
    window.parent.postMessage(msg, window.origin);
}


window.addEventListener('DOMContentLoaded', function() {
    console.log('Magenta proxy loaded DOM');
    sendMessage({
        isLoaded: true
    });
});


window.onmessage = async (ev) => {
    console.log('Magenta proxy onmessage ', ev);
    if (ev.source == window.parent && ev.origin == window.origin) {
        const msg = ev.data.msg;
        const requestid = ev.data.requestId;

        const result = await continueSequence(msg);
        sendMessage({
            msg: result,
            requestId: requestid
        });
    }
};






async function continueSequence(msg) {
    return {test: "test", testMsg: msg};
}

  
//   let melodyRnn = new music_rnn.MusicRNN( 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
//   let melodyRnnLoaded = melodyRnn.initialize()
  
//   document.getElementById('generate-melody').onclick = async () => {
//     await melodyRnnLoaded;
    
//     let seed = {
//       notes: [
//         {pitch: Tone.Frequency('C#3').toMidi(), quantizedStartStep: 0, quantizedEndStep: 4}
//       ],
//       totalQuantizedSteps: 4,
//       quantizationInfo: { stepsPerQuarter: 4}
//     };
//     let steps = 28;
//     let temperature = 1.2;
//     let chordProgression = ['C#m7'];
    
//     let result = await melodyRnn.continueSequence(seed, steps, temperature, chordProgression);
    
//     let combined = core.sequences.concatenate([seed, result]);
    
//     sequencer.matrix.populate.all([0]);
//     for (let note of combined.notes) {
//       let column = note.quantizedStartStep;
//       let noteName = Tone.Frequency(note.pitch, 'midi').toNote();
//       let row = sequencerRows.indexOf(noteName);
//       if (row >= 0) {
//         sequencer.matrix.set.cell(column, row, 1);
//       }
//     }
//     console.log(combined);
//   }
  