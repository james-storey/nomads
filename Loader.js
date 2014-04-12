// interface to load assets and provide progress reports to frontend
var AssetFactory = function (onFinish, onProgress) {
	var that = {};
	var map = {};
	var loader = THREE.JSONLoader(false);
	var filesLoaded;
	var filesToLoad;

	var loadAudio = function (key, uri) {
		var audio = new Audio();
		audio.AddEventListener('canplaythrough', finishLoading, false);
		audio.src = uri
		map[key] = audio;
	};

	var loadMesh = function (key, uri) {
		loader.load(uri, function (geo, mats) {
			map[key] = THREE.Mesh(geo, mats);
			finishLoading();
		});
	};

	var finishLoading = function () {
		filesLoaded += 1;
		if (filesToLoad <= filesLoaded) {
			// finish
			if(typeof onLoad === "function") {
				onFinish(map);
			}
		}
		else
		{
			onProgress(filesLoaded, filesToLoad);
		}
	}

	var loadAssets = function (assetMap, callback, progressCallback) {
		filesToLoad = Object.keys(assetMap).length;
		filesLoaded = 0;
		onProgress = progressCallback;
		onFinish = callback;
		if(filesToLoad === 0)
		{
			onFinish({});
		}
		for (var prop in assetMap) {
			if(typeof assetMap[prop] === "string") {
				var uri = assetMap[prop];
				if(uri.indexOf(".ogg") >= 0 || uri.indexOf(".mp3") >= 0)
				{
					// audio
					loadAudio(prop, uri);
				}
				else if(uri.indexOf(".js") >= 0 || uri.indexOf(".json") >= 0)
				{
					// mesh
					loadMesh(prop, uri);
				}
				else
				{
					console.error("file " + uri + " not supported");
				}
			}
		}
	};

	// for testing draw
	var dummyLoad = function(callback, progressCallback) {
		onProgress = progressCallback;
		onFinish = callback;
		var dummyTime = 0;
		var timerInterval = setInterval(function() {
			dummyTime += 1;
			if(dummyTime < 10) { 
				onProgress(dummyTime, 10);
			}
			else {
				clearInterval(timerInterval);
				onFinish();
			}
		}, 1000);
	};

	that.loadAssets = loadAssets;
	that.dummyLoad = dummyLoad;
	return that;
};

var LoadingScreen = function (width, height, assetMap, callback) {
	var factory = new AssetFactory();
	var map = assetMap || {};
	var that = {};
	var loading = true;
	var done = false;

	var barBorder = document.getElementById("barBorder");
	var elemHeight = height / 10;
	var elemWidth = width * 0.8;
	barBorder.style.height = elemHeight.toString();
	barBorder.style.width = elemWidth.toString();
	barBorder.style.top = (height / 2 - elemHeight).toString();
	barBorder.style.left = (elemWidth - width / 2).toString();

	var loadingBar = document.getElementById("loadingBar");
	loadingBar.style.height = elemHeight.toString();
	
	var finished = function(map) {
		done = true;
		loading = false;
		if (typeof callback === "function") {
			callback(map);
		}
		hideLoadingScreen();
	};

	var progress = function(loaded, total) {
		// update graphic
		var pcent = (loaded / total) * 100;
		loadingBar.style.width = pcent.toString() + "%";
	};

	// call from the main program's render loop
	// first call starts the load requests
	var animate = function() {
		if(loading === true) {
			if(typeof assetMap !== "object") {
				//factory.loadAssets(assetMap, finished, progress);
				factory.dummyLoad(finished, progress);
			}
			else {
				factory.loadAssets(assetMap, finished, progress);
			}
		}

	};

	var hideLoadingScreen = function () {
		barBorder.style.display = "none";
		loadingBar.style.display = "none";
	};

	that.animate = animate;
	that.done = done;

	return that;
};

/*var lScreen = new LoadingScreen(640, 480);

var testAnim = function() {
	if(lScreen.done === false)
		requestAnimationFrame(testAnim);
	lScreen.animate();
};*/