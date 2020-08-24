import {DISABLE_FACE_DETECTION} from './Debug';

import * as Ui from './Ui';

import * as ml5 from 'ml5';

// by default all options are set to true
const detection_options = {
    withLandmarks: false,
    withDescriptors: false,
}

export default class FaceDetector {

    faceapi;
    detections;
    ctx;

    constructor(private canvas: HTMLCanvasElement, private video: HTMLVideoElement) {
    }
 

    async start(){
        
        Ui.incrementLoadingItems();

        // get the video
        this.video = await this.getVideo();
        //this.ctx = this.canvas.getContext('2d');

        if (!DISABLE_FACE_DETECTION) {
            Ui.incrementLoadingItems();
            this.faceapi = ml5.faceApi(this.video, detection_options, () => {
                console.log('FaceDetector ready!')
                this.detect();
                Ui.decrementLoadingItems();
            });
        }

        Ui.decrementLoadingItems();
    }


    detect() {
        this.faceapi.detect((err, result) => this.gotResults(err, result))
    }

    gotResults(err, result) {
        if (err) {
            console.log(err)

            // Try again every once in a while instead of givng up forever.
            setTimeout(() => this.detect(), 2000);
            return;
        }
        
        // console.log(result)
        this.detections = result;

        // Clear part of the canvas
        // this.ctx.fillStyle = "#000000"
        // this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);

        // this.ctx.drawImage(this.video, 0,0, this.canvas.width, this.canvas.height);

        if (this.detections) {
            if(this.detections.length > 0) {
                // if (DEBUG) {
                //     this.drawBox(this.detections)
                //     this.drawLandmarks(this.detections)
                // }
            }
        }
        this.detect();
    }

    drawBox(detections){
        
        for(let i = 0; i < detections.length; i++){
            const alignedRect = detections[i].alignedRect;
            const x = alignedRect._box._x
            const y = alignedRect._box._y
            const boxWidth = alignedRect._box._width
            const boxHeight  = alignedRect._box._height
            
            this.ctx.beginPath();
            this.ctx.rect(x, y, boxWidth, boxHeight);
            this.ctx.strokeStyle = "#a15ffb";
            this.ctx.stroke();
            this.ctx.closePath();
        }
        
    }


    drawLandmarks(detections){

        for(let i = 0; i < detections.length; i++){
            const mouth = detections[i].parts.mouth; 
            const nose = detections[i].parts.nose;
            const leftEye = detections[i].parts.leftEye;
            const rightEye = detections[i].parts.rightEye;
            const rightEyeBrow = detections[i].parts.rightEyeBrow;
            const leftEyeBrow = detections[i].parts.leftEyeBrow;

            this.drawPart(mouth, true);
            this.drawPart(nose, false);
            this.drawPart(leftEye, true);
            this.drawPart(leftEyeBrow, false);
            this.drawPart(rightEye, true);
            this.drawPart(rightEyeBrow, false);

        }

    }

    drawPart(feature, closed){
        
        this.ctx.beginPath();
        for(let i = 0; i < feature.length; i++){
            const x = feature[i]._x;
            const y = feature[i]._y;
            
            if(i === 0){
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        if(closed === true){
            this.ctx.closePath();
        }
        this.ctx.stroke();
        
        
    }

    // Helper 
    async getVideo(){
        // // Grab elements, create settings, etc.
        // const videoElement = document.createElement('video');
        // videoElement.setAttribute("style", "display: none;"); 
        // videoElement.width = this.canvas.width;
        // videoElement.height = this.height;
        // document.body.appendChild(videoElement);

        // Create a webcam capture
        const capture = await navigator.mediaDevices.getUserMedia({ video: true })
        this.video.srcObject = capture;
        this.video.play();


        this.video.width = this.video.videoWidth || this.video.clientWidth;
        this.video.height = this.video.videoHeight || this.video.clientHeight;

        return this.video
    }

    createCanvas(w, h){
        const canvas = document.createElement("canvas"); 
        canvas.width  = w;
        canvas.height = h;
        document.body.appendChild(canvas);
        return canvas;
    }


}