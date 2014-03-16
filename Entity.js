// parts pattern of funtional inheritance

// basic plumbing for gameObjects
var Entity = function(sub) {
	var that = sub || {};
	var updateFuncs;
	if( that.updateFuncs === undefined ) {
		updateFuncs = [];
	}
	else {
		updateFuncs = that.updateFuncs;
	}

	var addUpdateFunc = function (f) {
		updateFuncs.push(f);
	};

	var update = function () {
		updateFuncs.forEach(function (f) {
			f();
		});
	};
	
	that.update = update;
	that.addUpdateFunc = addUpdateFunc;
	that.updateFuncs = updateFuncs;
	return that;
};

// renders to the screen
var Renderable = function (mesh, sub) {
	var Mesh, geometry, material, active = false;

	var that = sub || {};
	Entity(that);

	if(mesh instanceof THREE.Mesh) {
		Mesh = mesh;
		geometry = Mesh.geometry;
		material = Mesh.material;
		Nomads.scene.add(Mesh);
	}

	that.addUpdateFunc(function () {

	});

	var toggleActive = function () {
		that.active = !that.active;
		if(that.active === false) {
			Nomads.scene.remove(Mesh);
		}
		else {
			Nomads.scene.add(Mesh);
		}
		return that.active;
	}
	that.Mesh = Mesh;
	that.geometry = geometry;
	that.material = material;
	that.active = active;
	that.toggleActive = toggleActive;

	// init
	toggleActive();
	return that;
}

// is selectable
var Selectable = function(sub) {
	var selected = false;

	var that = sub || {};
	Entity(that);

	that.addUpdateFunc(function() {
		if (that.material === undefined) {
			return;
		}
		
		if(selected) {
			that.material.emissive.setHex(0xff0000);
		}
		else {
			that.material.emissive.setHex(0x000000);
		}
	});

	var select = function() {
		selected = true;
	}
	var deselect = function() {
		selected = false;
	}

	that.select = select;
	that.deselect = deselect;

	return that;
};

// can accept orders and move in the world
var Moveable = function(sub) {
	var that = sub || {};
	Entity(that);
	var moveSpeed = 1.0;
	var turnSpeed = 1.0;
	var moving = false;
	var turning = false;
	var target;
	var turnAxis;
	var currentAngle;

	if(that.Mesh !== undefined) {
		target = new THREE.Vector3().copy(that.Mesh.position); 
	}
	else {
		target = new THREE.Vector3();
	}

	var move = function (loc) {
		if(that.Mesh === undefined) {
			return;
		}
		target = loc;
		currentAngle = 0;
		var dir = new THREE.Vector3().subVectors(target, that.Mesh.position);
		turnAxis = that.Mesh.localToWorld(new THREE.Vector3(1,0,0)).cross(dir);
	}

	that.addUpdateFunc(function() {
		if(that.Mesh === undefined) {
			return;
		}
		var threshold = moveSpeed*moveSpeed;

		var pos = that.Mesh.position;
		var look = new THREE.Vector3(that.Mesh.rotation.toArray());
		var dir = new THREE.Vector3().subVectors(target,pos);
		if(look.dot(dir) > 0.01) {
			turning = true;
			// turn toward target
			currentAngle += turnSpeed;
			that.Mesh.rotateOnAxis(turnAxis, currentAngle);

		}
		else {
			that.Mesh.lookAt(target);
		}

		if(dir.lengthSq() > threshold) {
			moving = true;
			// move toward target
			pos.add(dir.normalize().multiplyScalar(moveSpeed));
		}
		else
		{
			moving = false;
		}
	});

	that.move = move
	that.moving = moving;
	that.moveSpeed = moveSpeed;

};

// plays animations and keeps animation state
var Animated = function(sub) {
	var that = sub || {};
	Entity(that);
};
