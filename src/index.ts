/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */


import PitchDetector from './PitchDetector';
import FaceDetector from './FaceDetector';
import Improvisor from './Improvisor';
import Renderer from './Renderer';
import {Timeline} from './Timeline';
import * as Ui from './Ui';
import {DISABLE_VIDEO} from './Debug';


import {Transport} from 'tone';









Ui.incrementLoadingItems();




const canvas: HTMLCanvasElement = document.getElementById('output');
const video: HTMLVideoElement = document.getElementById('video');

const pitchDetector = new PitchDetector();
const faceDetector = new FaceDetector(canvas, video);

const renderer = new Renderer(canvas, video);

const timeline = new Timeline(renderer, faceDetector);
const improvisor = new Improvisor();





window.addEventListener('DOMContentLoaded', async function() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  if (!DISABLE_VIDEO) {
    faceDetector.start();
    
    await renderer.start();
  }

  pitchDetector.onNote.subscribe((midiNote: number) => {
    console.log('NOTE: ' + midiNote);

    const note = timeline.addAndQuantizeNote(midiNote);

    //faceDetector.onNote(note);
    
    improvisor.onNote(note);
  });

  Ui.addOnStartedListener(async () => {
    await improvisor.start();
  
    pitchDetector.start();
    
  });


  Ui.decrementLoadingItems();
});

