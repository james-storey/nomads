// player controlled entity

var Villager = function() {
	var mesh;

	var that = {};
	Selectable(that);
	Moveable(that);

	// mesh initiation
	var objMat = new THREE.MeshLambertMaterial( {color: 0xda9680} );
	var objGeo = new THREE.CubeGeometry( 10, 10, 10, 1, 1, 1);
	mesh = new THREE.Mesh(objGeo, objMat);
	mesh.position.y = 5;

	Renderable(that, mesh);


	//Animated(that);

	return that;
}