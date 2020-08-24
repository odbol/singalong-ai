import {debugPrint} from './Debug';
import {Transport} from 'tone';

import * as THREE from 'three';

import {Note} from './magenta-proxy/Note';
import Renderer from './Renderer';
import FaceDetector from './FaceDetector';


// You must change both of these at the same time.
export const STEP_AS_SUBDIVISION = '8n';
export const STEPS_PER_BEAT = 2; // Assuming 1 beat = '4n' (quarter note)

export const MAX_STEPS = 16 / STEPS_PER_BEAT;

export function secondsToSteps(seconds) {
    const beatsPerSecond = Transport.bpm.value / 60;
    const numBeats = seconds / beatsPerSecond;
    return Math.round(STEPS_PER_BEAT * numBeats);
}

export class Timeline {

    private noteMeshes = [];

    private geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );

    constructor(private renderer: Renderer, private faceDetector: FaceDetector) {}

    addAndQuantizeNote(midiNote: number) {
        const quantizedStartStep = secondsToSteps(Transport.nextSubdivision(STEP_AS_SUBDIVISION));
        const quantizedEndStep = quantizedStartStep + STEPS_PER_BEAT;
        const note = {
            pitch: midiNote,
            quantizedStartStep,
            quantizedEndStep
        };

        this.addToScene(note);

        return note;
    }

    addToScene(note: Note) {
        const object = new THREE.Mesh( this.geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

        object.position.x = Math.random() * 80 - 40;
        object.position.y = Math.random() * 80 - 40;
        object.position.z = 0;

        const detections = this.faceDetector.detections;
        if (detections) {
            const mouth = detections[0]?.parts?.mouth; 
            if (mouth && mouth.length) {
                // for(let i = 0; i < mouth.length; i++){
                //     const x = mouth[i]._x;
                //     const y = mouth[i]._y;
                object.position.x = mouth[0]._x;
                object.position.y = mouth[0]._y;
            }
        }


        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        const MIN_MIDI_NOTE = 40;
        const MAX_MIDI_NOTE = 90;
        const pitchNormalized = (1 - (Math.max(0, note.pitch - MIN_MIDI_NOTE) / (MAX_MIDI_NOTE - MIN_MIDI_NOTE)))
        const size = pitchNormalized * 3;
        object.scale.x = size + 0.2;
        object.scale.y = size + 0.2;
        object.scale.z = size + 0.2;
                    
        debugPrint('addToScene ' + pitchNormalized);
        this.renderer.addPhysicalObject(object, pitchNormalized);

        object._note = note;
        this.noteMeshes.push(object);
    }
}