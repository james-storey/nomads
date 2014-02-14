var UI = function () {
	var moveHelperMesh;
	var moveHelperDelay = null;
	var that = {};

	var moveHelperInit = function () {
		var mat = new THREE.MeshLambertMaterial( {color: 0x0000dd} );
		var geo = new THREE.SphereGeometry( 20, 6, 6);
		var moveHelperMesh = new THREE.Mesh(geo, mat);
	}();

	var moveHelper = function (point) {
		moveHelperMesh.position.copy(point);
		Nomads.scene.add(moveHelperMesh);
		moveHelperDelay = 2.0;
	};

	var update = function () {
		if(moveHelperDelay !== null) {
			if(moveHelperDelay <= 0) {
				Nomads.scene.remove(moveHelperMesh);
				moveHelperDelay = null;
			}
			else {
				moveHelperDelay -= 1/60;
			}
		}
	};

	that.moveHelper = moveHelper;
	that.update = update;

	return that;
}();