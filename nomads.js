var Program = function() {
	var camera, scene, renderer;
	var terrainMesh;
	var world, body, mass, shape, timeStep = 1/60;

	that = {};

	var initThree = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
		camera.translateZ(100);
		camera.translateY(100);
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
		scene.add(camera);

		renderer = Detector.webgl? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		renderer.setClearColor(0x8096da, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);

		var viewport = renderer.domElement;
		document.body.appendChild(viewport);
		renderer.domElement.addEventListener('resize', onResize, false);
		renderer.domElement.addEventListener('mousedown', mouseDown, false);
		renderer.domElement.addEventListener('mouseup', mouseDown, false);
		renderer.domElement.addEventListener('keydown', handleKey.down, false);
		renderer.domElement.addEventListener('keyup', handleKey.up, false);

		// init geo

		var planeGeo = new THREE.PlaneGeometry(100, 100, 10, 10);
		for (var i = planeGeo.vertices.length - 1; i >= 0; i--) {
			var v = planeGeo.vertices[i];
			v.z = Math.sin(v.x/10)*5 - Math.cos(v.y/10)*5;
		};

		var mat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
		terrainMesh = new THREE.Mesh(planeGeo, mat);
		terrainMesh.position = new THREE.Vector3(0, 0, 0);
		terrainMesh.rotateX(-Math.PI/2);
		//terrainMesh.rotateY(1);
		scene.add(terrainMesh);

		/*var helper = new THREE.AxisHelper();
		helper.scale = new THREE.Vector3(10, 10, 10);
		helper.position.y = 1;
		terrainMesh.add(helper);*/

	};

	var initCannon = function() {
		world = new CANNON.World();
		world.gravity.set(0,0,0);
		world.broadphase = new CANNON.NaiveBroadphase();
		world.solver.iterations = 10;

	};

	var init = function() {
		initThree();
		initCannon();
	};

	var update = function() {
		requestAnimationFrame( update );
        updatePhysics();
        render();
	};

	var render = function() {
		renderer.render(scene, camera);
	};

	var updatePhysics = function() {
		world.step(timeStep);

		// copy coords from CANNON objects to THREE child objects

	};

	var onResize = function(event) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	};

	var mouseDown = function(event) {

	};

	var mouseUp = function(event) {

	};

	var handleKey = {
		hold: {},

		down: function(event){
			hold[event.keyCode] = true;
		},

		up: function(event){
			hold[event.keyCode] = false;
		},

		update: function() {

		} 
	}

	that.init = init;
	that.update = update;

	return that;
};

var program = new Program();
program.init();
program.update();