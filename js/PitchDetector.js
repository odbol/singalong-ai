export default class PitchDetector {

    pitch;

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
      this.pitch.getPitch(function(err, frequency) {
        if (frequency) {
          console.log('pitch: ' + frequency);
        } else {
          console.log('No pitch detected');
        }
        getPitch();
      })
    }
}