// parts pattern of funtional inheritance

// basic plumbing for gameObjects
var Entity = function(that) {
	var that = that || {};
	var updateFuncs = that.updatFuncs === undefined ? [] : that.updateFuncs;

	var addUpdateFunc = function (f) {
		updateFuncs.push(f);
	};

	var update = function () {
		for(var f in updateFuncs) {
			f();
		}
	};
	
	that.update = update;
	that.updateFunc = updateFunc;
	that.updateFuncs = updateFuncs;
	return that;
};

// renders to the screen
var Renderable = function (that, mesh) {
	var Mesh, geometry, material, active = false;

	var that = that || {};
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
var Selectable = function(that) {
	var selected = false;

	var that = that || {};
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
var Moveable = function(that) {
	var that = that || {};
	Entity(that);
};

// plays animations and keeps animation state
var Animated = function(that) {
	var that = that || {};
	Entity(that);
};