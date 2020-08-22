declare var ml5: any;

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

export default class FaceDetector {

    faceapi;
    video;
    detections;
    width = 360;
    height = 280;
    canvas;
    ctx;

 

    async start(){
        
        // get the video
        this.video = await this.getVideo();

        this.canvas = this.createCanvas(this.width, this.height);
        this.ctx = this.canvas.getContext('2d');

        this.faceapi = ml5.faceApi(this.video, detection_options, () => {
            console.log('ready!')
            this.detect();
        })

    }


    detect() {
        this.faceapi.detect((err, result) => this.gotResults(err, result))
    }

    gotResults(err, result) {
        if (err) {
            console.log(err)
            return
        }
        
        // console.log(result)
        this.detections = result;

        // Clear part of the canvas
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0,0, this.width, this.height);

        this.ctx.drawImage(this.video, 0,0, this.width, this.height);

        if (this.detections) {
            if(this.detections.length > 0){
                this.drawBox(this.detections)
                this.drawLandmarks(this.detections)
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
        // Grab elements, create settings, etc.
        const videoElement = document.createElement('video');
        videoElement.setAttribute("style", "display: none;"); 
        videoElement.width = this.width;
        videoElement.height = this.height;
        document.body.appendChild(videoElement);

        // Create a webcam capture
        const capture = await navigator.mediaDevices.getUserMedia({ video: true })
        videoElement.srcObject = capture;
        videoElement.play();

        return videoElement
    }

    createCanvas(w, h){
        const canvas = document.createElement("canvas"); 
        canvas.width  = w;
        canvas.height = h;
        document.body.appendChild(canvas);
        return canvas;
    }


}