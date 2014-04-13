
var AssetMap = {

};

var Program = function() {
	var world, body, mass, shape, timeStep = 1/60;
	var lScreen, tGeo;

	var that = {};

	var initThree = function() {
		Nomads.scene = new THREE.Scene();
		Nomads.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
		Nomads.camera.translateZ(100);
		Nomads.camera.translateY(100);
		Nomads.camera.lookAt(new THREE.Vector3());
		Nomads.scene.add(Nomads.camera);

		Nomads.renderer = Detector.webgl? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		Nomads.renderer.setClearColor(0x8096da, 1);
		Nomads.renderer.setSize(window.innerWidth, window.innerHeight);

		var viewport = Nomads.renderer.domElement;
		document.body.appendChild(viewport);
		window.addEventListener('resize', onResize, false);
		window.addEventListener('mousedown', handleMouse.down, false);
		window.addEventListener('mouseup', handleMouse.up, false);
		window.addEventListener('keydown', handleKey.down, false);
		window.addEventListener('keyup', handleKey.up, false);
		window.addEventListener('mousemove', handleMouse.move, false);

		// init geo

		tGeo = TerrainGeo();
		tGeo.setLocation(0, 0);

		var aL = new THREE.AmbientLight( 0x404040 );
		var dL = new THREE.DirectionalLight({color: 0xffffff});
		dL.position = new THREE.Vector3( 1, 1.5, 1 );
		Nomads.scene.add(aL);
		Nomads.scene.add(dL);

		var villager = Villager();
		villager.Mesh.add(tGeo.Mesh);
		Nomads.selectableObjects.push(villager);

	};

	var initCannon = function() {
		world = new CANNON.World();
		world.gravity.set(0,0,0);
		world.broadphase = new CANNON.NaiveBroadphase();
		world.solver.iterations = 10;

	};

	var init = function() {
		var afterLoad = function(map) {
			AssetMap = map;
			initThree();
			initCannon();
		};

		lScreen = new LoadingScreen(window.innerWidth, window.innerHeight, AssetMap, afterLoad);
	};

	var update = function() {
		requestAnimationFrame( update );
		lScreen.animate();
		if(tGeo !== undefined)
		{
			var tpos = tGeo.Mesh.localToWorld(tGeo.Mesh.position.clone());
			tGeo.setLocation(tpos.x, tpos.z);
		}
		Nomads.UI.update();
    	updatePhysics();
    	handleKey.update();
    	handleMouse.update();
    	Nomads.selectableObjects.forEach(function(obj){obj.update();});
    	render();
	};

	var render = function() {
		Nomads.renderer.render(Nomads.scene, Nomads.camera);
	};

	var updatePhysics = function() {
		world.step(timeStep);
		// copy coords from CANNON objects to THREE child objects
	};

	var onResize = function() {
		Nomads.camera.aspect = window.innerWidth / window.innerHeight;
		Nomads.camera.updateProjectionMatrix();

		Nomads.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	that.init = init;
	that.update = update;

	return that;
};

var program = new Program();
program.init();
program.update();
