import {Subject} from 'rxjs';
import { distinctUntilChanged, filter, throttleTime } from 'rxjs/operators';

import {Frequency} from 'tone';

import {debugPrint} from './Debug';

import * as ml5 from 'ml5';

export default class PitchDetector {

    pitch;
    
    private noteSubject = new Subject();

    onNote = this.noteSubject
                .pipe(distinctUntilChanged(), filter(f => f > 0), throttleTime(300))

    constructor() {

    }
    
    async start() {
      const audioContext = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.startPitch(stream, audioContext);
    }
    
    startPitch(stream, audioContext) {
      this.pitch = ml5.pitchDetection('./ml/pitchDetection', audioContext , stream, () => this.getPitch());
    }
    
    getPitch() {
      this.pitch.getPitch((err, frequency) => {
        if (frequency) {
          const midi = Frequency(frequency).toMidi();

          debugPrint('pitch: ' + frequency, midi);
          
          this.noteSubject.next(midi);
        } else {
          debugPrint('No pitch detected');

          //this.noteSubject.next(0);
        }
        this.getPitch();
      })
    }
}