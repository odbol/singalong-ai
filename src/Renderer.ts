import {DEBUG} from './Debug';

import * as THREE from 'three';


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
        
        this.camera = new THREE.PerspectiveCamera( 60, this.width / this.height, 0.1, 100 );
        this.camera.position.z = 0.01;

        this.scene = new THREE.Scene();

        var texture = new THREE.VideoTexture( this.video );

        var geometry = new THREE.PlaneBufferGeometry( 16, 9 );
        geometry.scale( 0.5, 0.5, 0.5 );
        var material = new THREE.MeshBasicMaterial( { map: texture } );

        var count = 128;
        var radius = 32;

        for ( var i = 1, l = count; i <= l; i ++ ) {

            var phi = Math.acos( - 1 + ( 2 * i ) / l );
            var theta = Math.sqrt( l * Math.PI ) * phi;

            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.setFromSphericalCoords( radius, phi, theta );
            mesh.lookAt( this.camera.position );
            this.scene.add( mesh );

        }

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