var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};


window.addEventListener("load", init, false);

function init() {
	// set up scene, camera and renderer
	createScene();

	// add lights
	createLights();

	// add objects
	//createGundam();
	createPlanet();
	createSky();

	// start a loop that will update the objects' positions, and render the scene on each frame
	loop();
}

var scene, camera, fieldOfView, aspectRatio, nearGundam, farGundam, HEIGHT, WIDTH, renderer, container;

function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearGundam = 1;
  farGundam = 10000;
  camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearGundam,
  farGundam
  );

  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  // Create the renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

var hemisphereLight, shadowLight;

function createLights() {

	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	// set direction of light
	shadowLight.position.set(150, 350, 350);
	shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define resolution of the shadow
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	scene.add(hemisphereLight);
	scene.add(shadowLight);
}

//define planet
Planet = function(){

	var geom = new THREE.CylinderGeometry(600,600,800,40,10);

	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

	var mat = new THREE.MeshPhongMaterial({
		color:Colors.blue,
		transparent:true,
		opacity:.6,
		shading:THREE.FlatShading,
	});

	this.mesh = new THREE.Mesh(geom, mat);

	this.mesh.receiveShadow = true;
}

var planet;

function createPlanet(){
	planet = new Planet();

	// push it a little bit at the bottom of the scene
	planet.mesh.position.y = -600;

	// add the mesh of the sea to the scene
	scene.add(planet.mesh);
}

Cloud = function(){

	this.mesh = new THREE.Object3D();

	var geom = new THREE.BoxGeometry(20,20,20);

	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,
	});

	var nBlocs = 3+Math.floor(Math.random()*3);
	for (var i=0; i<nBlocs; i++ ){

		var m = new THREE.Mesh(geom, mat);

		m.position.x = i*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;

		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);

		m.castShadow = true;
		m.receiveShadow = true;

		this.mesh.add(m);
	}
}

// define sky
Sky = function(){

	this.mesh = new THREE.Object3D();

	// choose number of clouds to be scattered in the sky
	this.nClouds = 20;

	// To distribute the clouds consistently, need to place them according to uniform angle
	var stepAngle = Math.PI*2 / this.nClouds;

	// create the clouds
	for(var i=0; i<this.nClouds; i++){
		var c = new Cloud();

		// set the rotation and the position of each cloud
		var a = stepAngle*i; // final angle of the cloud
		var h = 750 + Math.random()*200; // distance between the center of the axis and the cloud itself

		// trig, converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;

		c.mesh.rotation.z = a + Math.PI/2;

		c.mesh.position.z = -400-Math.random()*400;

		// set a random scale for each cloud
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		this.mesh.add(c.mesh);
	}
}

var sky;

function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}

renderer.render(scene, camera);
