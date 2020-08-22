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
import {DISABLE_VIDEO} from './Debug';















const pitchDetector = new PitchDetector();
const faceDetector = new FaceDetector(document.getElementById('output'));







window.addEventListener('DOMContentLoaded', function() {
  if (!DISABLE_VIDEO) {
    faceDetector.start();
  }

  pitchDetector.onNote.subscribe((midiNote: number) => {
    console.log('NOTE: ' + midiNote);
  });
});









document.querySelector('body').onclick = () => {
  pitchDetector.start();
};
