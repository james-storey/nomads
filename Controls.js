var handleMouse = function() {
	var hold = {};
	var selectBoxElem = document.getElementById("select-box");
	var selectableObjects = Nomads.selectableObjects;
	var selected = Nomads.selected;
	var projector = new THREE.Projector();

	var that = {};

	var rayCastScreenLocation = function(x, y) {
		var camera = Nomads.camera; 
		var vector = new THREE.Vector3((x / window.innerWidth) * 2 - 1, 
			-(y / window.innerHeight) * 2 + 1, 0.5);
		projector.unprojectVector(vector, Nomads.camera);

		var raycaster = new THREE.Raycaster(camera.position,
			vector.sub(camera.position).normalize());
		return raycaster;
	};

	var down = function(event) {
		hold['down'] = new THREE.Vector2(event.clientX, event.clientY);
		// anchor selection aid
		if(event.which === 1) { //LEFT_BUTTON
			selectBoxElem.style.top = event.clientY;
			selectBoxElem.style.left = event.clientX;
		}
		else if(event.which === 3) { //RIGHT_BUTTON
			//move selected to location
			var raycaster = rayCastScreenLocation(event.clientX, event.clientY);
			var intersectPoint = raycaster.intersectObject(Nomads.terrainMesh)[0].point;

			// create move helper

			// signal selected to deal with order
		}
		
	};

	var up = function(event) {
		var down = hold['down'];
		var camera = Nomads.camera;
		var clickZone = 1;
		for (var sO = selected.length - 1; sO >= 0; sO -= 1) {
			(selected.pop()).deselect();
		}
		if (Math.abs(down.x - event.clientX) < clickZone && 
			Math.abs(down.y - event.clientY) < clickZone) {
			// raycast select
			var raycaster = rayCastScreenLocation(down.x, down.y);
			var intersect = [];
			var sO = 0, intersectIndex;
			for (sO = selectableObjects.length - 1; sO >= 0 && intersect.length < 1; sO -= 1) {
				intersect = raycaster.intersectObject(selectableObjects[sO].Mesh);
				intersectIndex = sO;
			}
			if (intersect.length > 0) {
				selected.push(selectableObjects[intersectIndex]);
				selectableObjects[intersectIndex].select();
			}
		}
		else {
			// bounded select
			for (var oi = 0, ol = selectableObjects.length; oi < ol; oi ++){
				// project center of object to screen
				var obj = selectableObjects[oi].Mesh;
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
					selected.push(selectableObjects[oi]);
					selectableObjects[oi].select();

				}
			}	
		}
		selectBoxElem.style.visibility = "hidden";
		hold['down'] = null;
	};

	var move = function(event) {
		hold['mouseX'] = event.clientX;
		hold['mouseY'] = event.clientY;
		if (hold['down'] instanceof THREE.Vector2) {
			selectBoxElem.style.visibility = "visible";
		}
	};

	var update = function() {
		if (hold['down'] instanceof THREE.Vector2) {
			var mouseX = hold['mouseX'];
			var mouseY = hold['mouseY'];
			var d = hold['down'];

			if(mouseY < d.y) {
				selectBoxElem.style.top = mouseY;
				selectBoxElem.style.height = d.y - mouseY;
			}
			else { 
				selectBoxElem.style.height = mouseY - d.y;
			}

			if(mouseX < d.x) {
				selectBoxElem.style.left = mouseX;
				selectBoxElem.style.width = d.x - mouseX;
			}
			else {
				selectBoxElem.style.width = mouseX - d.x;
			}
		}
	};

	that.down = down;
	that.up = up;
	that.move = move;
	that.update = update;

	return that;
}();

var handleKey = function() {
	var hold = {};
	var camera;
	var cameraCenter = new THREE.Vector3();
	var cameraSpeed = 0.5;

	var that = {};

	var down = function(event){
		hold[event.keyCode] = true;
	};

	var up = function(event){
		hold[event.keyCode] = false;
	};

	var update = function() {
		camera = Nomads.camera;
		var translateSpeed = cameraSpeed * 1.4;
		var axis = new THREE.Vector3();
		axis.copy(cameraCenter).sub(camera.position);
		axis.y = 0;
		axis.normalize();
		rightAxis = new THREE.Vector3().copy(axis).cross(new THREE.Vector3(0,1,0)).normalize();
		if (hold["W".charCodeAt(0)] === true)
		{
			var forward = new THREE.Vector3().copy(axis);
			forward.multiplyScalar(translateSpeed);
			camera.position.add(forward);
			cameraCenter.add(forward);
		}
		if (hold["S".charCodeAt(0)] === true)
		{
			var back = new THREE.Vector3().copy(axis);
			back.multiplyScalar(-translateSpeed);
			camera.position.add(back);
			cameraCenter.add(back);
		}
		if (hold["A".charCodeAt(0)] === true)
		{
			var left = new THREE.Vector3().copy(rightAxis);
			left.multiplyScalar(-translateSpeed);
			camera.position.add(left);
			cameraCenter.add(left);
		}
		if (hold["D".charCodeAt(0)] === true)
		{
			var right = new THREE.Vector3().copy(rightAxis);
			right.multiplyScalar(translateSpeed);
			camera.position.add(right);
			cameraCenter.add(right);
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
		if(hold["Q".charCodeAt(0)] === true)
		{
			// orbit CCW
			rotateCamera(true);
			camera.lookAt(cameraCenter);
		}
		if(hold["E".charCodeAt(0)] === true)
		{
			// orbit CW
			rotateCamera(false);
			camera.lookAt(cameraCenter);
		}
	};

	that.up = up;
	that.down = down;
	that.update = update;

	return that;
}();