import {DEBUG} from './Debug';

import * as THREE from 'three';
import * as CANNON from 'cannon';
import Stats from 'stats-js';

declare var __THREE_DEVTOOLS__: any;

const timeStep=1/30;
const INITIAL_VELOCITY = 100;

export default class Renderer {

    renderer;
    camera;
    scene;
    width = 360;
    height = 280;

    stats;

    world;
    bodies = [];

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

        if (DEBUG) {
            this.stats = new Stats();
            document.body.appendChild( this.stats.dom );
        }

        this.setupPhysics();

        this.animate();
    }

    setupPhysics() {
        // Setup our world
        this.world = new CANNON.World();
        this.world.gravity.set(0, -10, 0); // m/s²
        this.world.broadphase = new CANNON.NaiveBroadphase();

        // Create a plane
        var groundBody = new CANNON.Body({
            mass: 0 // mass == 0 makes the body static
        });
        var groundShape = new CANNON.Plane();
        groundBody.addShape(groundShape);
        //this.world.addBody(groundBody);
    }

    updatePhysics() {

        // Step the physics world
        this.world.step(timeStep);

        // Copy coordinates from Cannon.js to Three.js
        for (let body of this.bodies) {
            body.mesh.position.copy(body.position);
            body.mesh.quaternion.copy(body.quaternion);
        }
    }

    addPhysicalObject(mesh, pitchNormalized) { 
        const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
        const body = new CANNON.Body({
          mass: 4
        });
        body.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
        body.velocity.set(pitchNormalized * INITIAL_VELOCITY * 2 - INITIAL_VELOCITY , -INITIAL_VELOCITY, 20);
        body.addShape(shape);
        body.angularVelocity.set(Math.random() * 5, Math.random() * 5, Math.random() * 5);
        body.angularDamping = 0.1;

        body.mesh = mesh;
        
        this.bodies.push(body);

        this.world.addBody(body);
        this.scene.add(mesh);
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

        this.updatePhysics();

        this.renderer.render( this.scene, this.camera );

        if (this.stats) {
            this.stats.update();
        }
    }
}