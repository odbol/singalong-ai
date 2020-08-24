import {Transport} from 'tone';

import * as THREE from 'three';

import {Note} from './magenta-proxy/Note';
import Renderer from './Renderer';


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

    constructor(private renderer: Renderer) {}

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
        object.position.z = Math.random() > 0.5 ? 5 : -5;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = (note.pitch / 80) + 0.5;
        object.scale.y = (note.pitch / 80) + 0.5;
        object.scale.z = (note.pitch / 80) + 0.5;
                    
        this.renderer.scene.add(object);

        object._note = note;
        this.noteMeshes.push(object);
    }
}