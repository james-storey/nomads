var SelectableObject = function(mesh, pBody) {
	var selected = false;
	var Mesh, geometry, material;

	var that = {};

	if(mesh instanceof THREE.Mesh) {
		Mesh = mesh;
		geometry = Mesh.geometry;
		material = Mesh.material;
	}

	var update = function() {
		if(selected) {
			material.emissive.setHex(0xff0000);
		}
		else {
			material.emissive.setHex(0x000000);
		}
	}

	var select = function() {
		selected = true;
	}
	var deselect = function() {
		selected = false;
	}

	that.Mesh = Mesh;
	that.geometry = geometry;
	that.material = material;
	that.update = update;
	that.select = select;
	that.deselect = deselect;

	return that;
};