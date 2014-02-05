var Program = function() {
	var camera, scene, renderer;
	var world, body, mass, shape, timeStep = 1/60;

	that = {};

	var initThree = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
		camera.translateZ(100);
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
		scene.add(camera);

		renderer = Detector.webgl? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		renderer.setClearColor(0x8096da, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);

		var viewport = renderer.domElement;
		document.body.appendChild(viewport);
		window.onresize = (onResize);
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

	that.init = init;
	that.update = update;

	return that;
};

var program = new Program();
program.init();
program.update();