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
};

// plays animations and keeps animation state
var Animated = function(sub) {
	var that = sub || {};
	Entity(that);
};
