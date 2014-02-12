var Program = function() {
	var camera, scene, renderer;
	var cameraCenter, cameraSpeed, projector;
	var terrainMesh, objMesh;
	var world, body, mass, shape, timeStep = 1/60;
	var selected = [];
	var selectableObjects = [];

	that = {};

	var initThree = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
		camera.translateZ(100);
		camera.translateY(100);
		camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
		cameraCenter = new THREE.Vector3( 0, 0, 0 );
		cameraSpeed = 0.5;
		scene.add(camera);

		projector = new THREE.Projector();

		renderer = Detector.webgl? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		renderer.setClearColor(0x8096da, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);

		var viewport = renderer.domElement;
		document.body.appendChild(viewport);
		window.addEventListener('resize', onResize, false);
		window.addEventListener('mousedown', handleMouse.down, false);
		window.addEventListener('mouseup', handleMouse.up, false);
		window.addEventListener('keydown', handleKey.down, false);
		window.addEventListener('keyup', handleKey.up, false);

		// init geo

		var planeGeo = new THREE.PlaneGeometry(100, 100, 10, 10);
		//for (var i = planeGeo.vertices.length - 1; i >= 0; i--) {
		//	var v = planeGeo.vertices[i];
		//	v.z = Math.sin(v.x/10)*5 - Math.cos(v.y/10)*5;
		//};
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
		selectableObjects.push(objMesh);

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

	var handleMouse = {
		hold: {},

		down: function(event) {
			handleMouse.hold['down'] = new THREE.Vector2(event.clientX, event.clientY); 
		},

		up: function(event) {
			var down = handleMouse.hold['down'];
			var clickZone = 0.5;
			selected.length = 0;
			if (Math.abs(down.x - event.clientX) < clickZone && 
				Math.abs(down.y - event.clientY) < clickZone) {
				// raycast select
				var vector = new THREE.Vector3((down.x / window.innerWidth) * 2 - 1, 
					-(down.y / window.innerHeight) * 2 + 1, 0.5);
				projector.unprojectVector(vector, camera);

				var raycaster = new THREE.Raycaster(camera.position,
					vector.sub(camera.position).normalize());
				var intersects = raycaster.intersectObjects(selectableObjects);
				selected.push(intersects[0]);
			}
			else {
				// bounded select
				for(var oi = 0, ol = selectableObjects.length; oi < ol; oi ++){
					// project center of object to screen
					var obj = selectableObjects[oi];
					var posCopy = new THREE.Vector3();
					posCopy.copy(obj.position);

					// normalized centered coords
					var first = new THREE.Vector2((down.x / window.innerWidth) * 2 - 1,
						-(down.y / window.innerHeight) * 2 + 1);
					var second = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1,
						-(event.clientY/window.innerHeight) * 2 + 1);
					var min = new THREE.Vector2(Math.min(first.x, second.x), Math.min(first.y, second.y));
					var max = new THREE.Vector2(Math.max(first.x, second.x), Math.max(first.y, second.y));
					var selectBox = new THREE.Box2(min, max);
					
					var screenCoord = projector.projectVector(posCopy, camera);
					//get size of projected bounding sphere
					var gC = new THREE.Vector3();
					gC.copy(obj.position);
					gC.sub(camera.position);
					var gCircle = (new THREE.Vector3()).crossVectors(gC, new THREE.Vector3(0,1,0)).normalize();
					gCircle.multiplyScalar(obj.geometry.boundingSphere.radius * 2);
					gCircle.add(obj.position);
					var gCircleScreen = projector.projectVector(gCircle, camera);
					var objBoxSize = (new THREE.Vector2(gCircleScreen.x, gCircleScreen.y)).sub(screenCoord).length();

					var objBox = new THREE.Box2();
					objBox.setFromCenterAndSize(new THREE.Vector2(screenCoord.x, screenCoord.y), 
						new THREE.Vector2(objBoxSize, objBoxSize));
					
					// fudge with bounding sphere radius
					if (selectBox.isIntersectionBox(objBox) || selectBox.containsBox(objBox)){
						// inside bounds, add to selection
						selected.push(obj);
					}
				}
				
			}
		}
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

			var rotateCamera = function(CCW) {
				var dir = 1, d;
				if(CCW !== true){
					dir = -1;
				}
				d = new THREE.Vector2(camera.position.x - cameraCenter.x, camera.position.z - cameraCenter.z);
				rotSpeed = cameraSpeed * 0.05;
				camera.position.x = cameraCenter.x + d.x * Math.cos(rotSpeed) - 
					d.y*Math.sin(rotSpeed) * dir;
				camera.position.z = cameraCenter.z + d.x * Math.sin(rotSpeed) * dir + 
					d.y*Math.cos(rotSpeed);
			};
			if(handleKey.hold["Q".charCodeAt(0)] === true)
			{
				// orbit CCW
				rotateCamera(true);
				camera.lookAt(cameraCenter);
			}
			if(handleKey.hold["E".charCodeAt(0)] === true)
			{
				// orbit CW
				rotateCamera(false);
				camera.lookAt(cameraCenter);
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