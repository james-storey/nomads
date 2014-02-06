var Program = function() {
	var camera, scene, renderer;
	var cameraCenter, cameraSpeed, cameraHandle;
	var terrainMesh, objMesh;
	var world, body, mass, shape, timeStep = 1/60;

	that = {};

	var initThree = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
		camera.translateZ(100);
		camera.translateY(100);
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
		cameraCenter = new THREE.Vector3( 0, 0, 0 );
		cameraSpeed = 0.5;
		cameraHandle = new THREE.Object3D();
		cameraHandle.translateZ(100);
		cameraHandle.translateY(100);
		cameraHandle.add(camera);
		scene.add(camera);

		renderer = Detector.webgl? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		renderer.setClearColor(0x8096da, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);

		var viewport = renderer.domElement;
		document.body.appendChild(viewport);
		window.addEventListener('resize', onResize, false);
		window.addEventListener('mousedown', mouseDown, false);
		window.addEventListener('mouseup', mouseUp, false);
		window.addEventListener('keydown', handleKey.down, false);
		window.addEventListener('keyup', handleKey.up, false);

		// init geo

		var planeGeo = new THREE.PlaneGeometry(100, 100, 10, 10);
		for (var i = planeGeo.vertices.length - 1; i >= 0; i--) {
			var v = planeGeo.vertices[i];
			v.z = Math.sin(v.x/10)*5 - Math.cos(v.y/10)*5;
		};
		planeGeo.computeFaceNormals();
		planeGeo.computeVertexNormals();

		var mat = new THREE.MeshLambertMaterial({color: 0xffffff});
		terrainMesh = new THREE.Mesh(planeGeo, mat);
		terrainMesh.position = new THREE.Vector3(0, 0, 0);
		terrainMesh.rotateX(-Math.PI/2);
		//terrainMesh.rotateY(1);
		scene.add(terrainMesh);

		var aL = new THREE.AmbientLight( 0x404040 );
		var dL = new THREE.DirectionalLight({color: 0xffffff});
		dL.position = new THREE.Vector3( 1, 1, 1 );
		scene.add(aL);
		scene.add(dL);

		var objMat = new THREE.MeshLambertMaterial( {color: 0xda9680} );
		var objGeo = new THREE.CubeGeometry( 10, 10, 10, 1, 1, 1);
		objMesh = new THREE.Mesh(objGeo, objMat);
		objMesh.position.y = 5;
		scene.add(objMesh);

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
        handleKey.update();
        render();
	};

	var render = function() {
		renderer.render(scene, camera);
	};

	var updatePhysics = function() {
		world.step(timeStep);

		// copy coords from CANNON objects to THREE child objects

	};

	var onResize = function() {
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
			handleKey.hold[event.keyCode] = true;
		},

		up: function(event){
			handleKey.hold[event.keyCode] = false;
		},

		update: function() {
			if (handleKey.hold["W".charCodeAt(0)] === true)
			{
				camera.position.z += -cameraSpeed;
				cameraCenter.z += -cameraSpeed;
			}
			if (handleKey.hold["S".charCodeAt(0)] === true)
			{
				camera.position.z += cameraSpeed;
				cameraCenter.z += cameraSpeed;
			}
			if (handleKey.hold["A".charCodeAt(0)] === true)
			{
				camera.position.x += -cameraSpeed;
				cameraCenter.x += -cameraSpeed;
			}
			if (handleKey.hold["D".charCodeAt(0)] === true)
			{
				camera.position.x += cameraSpeed;
				cameraCenter.x += cameraSpeed;
			}
			if(handleKey.hold["Q".charCodeAt(0)] === true)
			{
				// orbit CCW
			}
			if(handleKey.hold["E".charCodeAt(0)] === true)
			{
				// orbit CW
			}
		} 
	}

	that.init = init;
	that.update = update;

	return that;
};

var program = new Program();
program.init();
program.update();