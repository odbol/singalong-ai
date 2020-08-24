import {DEBUG} from './Debug';

import * as THREE from 'three';

declare var __THREE_DEVTOOLS__: any;

export default class Renderer {

    renderer;
    camera;
    scene;
    width = 360;
    height = 280;

    constructor(private canvas: HTMLCanvasElement, private video: HTMLVideoElement) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
 

    async start(){
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        
        this.scene = new THREE.Scene();
        
        // this.camera = new THREE.PerspectiveCamera( 60, this.width / this.height, 0.1, 100 );
        // this.camera.position.z = 0.01;
        this.camera = new THREE.OrthographicCamera( this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, -1000, 1000 );


        var light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( light );


        var texture = new THREE.VideoTexture( this.video );

        var geometry = new THREE.PlaneBufferGeometry( this.width, this.height );
        geometry.scale( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { map: texture } );

     
        var mesh = new THREE.Mesh( geometry, material );
        //mesh.position.setFromSphericalCoords( radius, phi, theta );
        mesh.position.set(0,0,-100);
        mesh.lookAt( this.camera.position );
        this.scene.add( mesh );


        this.renderer = new THREE.WebGLRenderer( { 
            canvas: this.canvas, 
            antialias: true 
        } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.width, this.height );

        // var controls = new OrbitControls( this.camera, this.renderer.domElement );
        // controls.enableZoom = false;
        // controls.enablePan = false;

        window.addEventListener( 'resize', () => this.onWindowResize(), false );

        // Observe a scene or a renderer
        if (typeof __THREE_DEVTOOLS__ !== 'undefined') {
            __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: this.scene }));
            __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: this.renderer }));
        }

        this.animate();
    }

    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.width, this.height );

    }

    animate() {

        requestAnimationFrame( () => this.animate() );
        this.renderer.render( this.scene, this.camera );

    }
}