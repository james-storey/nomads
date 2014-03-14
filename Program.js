
var Program = function() {
	var world, body, mass, shape, timeStep = 1/60;

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

		var planeGeo = new THREE.PlaneGeometry(100, 100, 10, 10);
		//for (var i = planeGeo.vertices.length - 1; i >= 0; i--) {
		//	var v = planeGeo.vertices[i];
		//	v.z = Math.sin(v.x/10)*5 - Math.cos(v.y/10)*5;
		//};
		planeGeo.computeFaceNormals();
		planeGeo.computeVertexNormals();

		var mat = new THREE.MeshLambertMaterial({color: 0xffffff});
		Nomads.terrainMesh = new THREE.Mesh(planeGeo, mat);
		Nomads.terrainMesh.position = new THREE.Vector3(0, 0, 0);
		Nomads.terrainMesh.rotateX(-Math.PI/2);
		//terrainMesh.rotateY(1);
		Nomads.scene.add(Nomads.terrainMesh);

		var aL = new THREE.AmbientLight( 0x404040 );
		var dL = new THREE.DirectionalLight({color: 0xffffff});
		dL.position = new THREE.Vector3( 1, 1, 1 );
		Nomads.scene.add(aL);
		Nomads.scene.add(dL);

		var objMat = new THREE.MeshLambertMaterial( {color: 0xda9680} );
		var objGeo = new THREE.CubeGeometry( 10, 10, 10, 1, 1, 1);
		var objMesh = new THREE.Mesh(objGeo, objMat);
		objMesh.position.y = 5;

		var ch = new Renderable(objMesh);
		Nomads.selectableObjects.push(Selectable(ch));


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
