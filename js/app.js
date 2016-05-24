var colours = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};


window.addEventListener("load", init, false);

function init() {
	// set up scene, camera and renderer
	createScene();

	// add lights
	createLights();

	// add objects
	createGundamBoy();
	createSea();
	createSky();

	// start a loop that will update the objects' positions, and render the scene on each frame
	loop();
}
