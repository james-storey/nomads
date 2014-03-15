// player controlled entity

var Villager = function(sub) {
	var Mesh;

	var that = sub || {};
	Selectable(that);
	Moveable(that);

	// mesh initiation
	var objMat = new THREE.MeshLambertMaterial( {color: 0xda9680} );
	var objGeo = new THREE.CubeGeometry( 10, 10, 10, 1, 1, 1);
	Mesh = new THREE.Mesh(objGeo, objMat);
	Mesh.position.y = 5;

	Renderable(Mesh, that);


	//Animated(that);

	return that;
}