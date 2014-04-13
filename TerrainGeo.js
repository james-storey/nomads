
var TerrainGeo = function () {
	that = {};
	var geo = new THREE.CubeGeometry( 100, 100, 100, 10, 10, 10);
	var mat = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe:true});
	var simplex = new SimplexNoise();
	Nomads.terrainMesh = new THREE.Mesh(geo, mat);
	Nomads.terrainMesh.position = new THREE.Vector3(0, -50, 0);
	//Nomads.scene.add(Nomads.terrainMesh);
	var scale = 0.01;
	var baseY = 0;
	var topVerts = [];

	// collect verts by position
	var topY = 49.5;
	for(var i = 0; i < geo.vertices.length; i += 1)
	{
		if(geo.vertices[i].y >= topY)
		{
			topVerts.push(geo.vertices[i]);
			baseY = geo.vertices[i].y;
		}
	}

	var setLocation = function(x, z) {
		for(var i = 0; i < topVerts.length; i += 1)
		{
			var v = topVerts[i];
			//var dir = new THREE.Vector3(0, 1, 0);
			var yVal = simplex.noise((x + v.x) * scale, (z + v.z) * scale) * 10;
			v.y = baseY + yVal;
		}

		//geo.computeVertexNormals();
		//geo.computeFaceNormals();
		geo.verticesNeedUpdate = true;
	};

	that.setLocation = setLocation;
	that.Mesh = Nomads.terrainMesh;
	return that;
};