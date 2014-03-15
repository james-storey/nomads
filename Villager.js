// player controlled entity

var Villager = function(sub) {
	var Mesh;

	var that = sub || {};
	Selectable(that);

	// mesh initiation
	var objMat = new THREE.MeshLambertMaterial( {color: 0xda9680} );
	var objGeo = new THREE.CubeGeometry( 10, 10, 10, 1, 1, 1);
	Mesh = new THREE.Mesh(objGeo, objMat);
	Mesh.position.y = 5;

	Renderable(Mesh, that);
	Moveable(that);


	//Animated(that);

	return that;
}