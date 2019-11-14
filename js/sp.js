if(window.DeviceOrientationEvent)
window.addEventListener("deviceorientation", handleOrientation, true);

if (window.DeviceMotionEvent) {
	window.last_move = {x: 0, y:0, z: 0};
  window.addEventListener('devicemotion', deviceMotionHandler);
}
 
function handleOrientation(event) {
  var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;
  window.plane.obj.rotation.set( beta*Math.PI/180, gamma*Math.PI/180, alpha*Math.PI/180 );
  /*document.querySelector('#msg').innerText = 
  'absolute: '+absolute+' '
  +'alpha: '+alpha+' '
  +'beta: '+beta+' '
  +'gamma'+gamma;*/
}

/*function deviceMotionHandler(event){
	if(!event.acceleratimon) return;
	window.plane.obj.position.z = 0;
	let move = {x: event.acceleratimon.x, y: event.acceleration.y, z: event.acceleration.z};
	
	if(window.last_move.x - move.x > 0){
		window.plane.obj.position.x += move.x*2
	}
	if(window.last_move.y - move.y > 0){
		window.plane.obj.position.y += move.y*2
	}
	if(window.last_move.z - move.z > 0){
		window.plane.obj.position.z += move.z*2
	}

	window.last_move = Object.assign({}, move) ;
	//window.last_sign = sign;
}*/

function deviceMotionHandler(event){
	let move = {x: event.acceleration.x, y: event.acceleration.y, z: event.acceleration.z};
	window.plane.obj.position.x += event.acceleration.x*2;
	window.plane.obj.position.y += event.acceleration.z*2;
	window.plane.obj.position.z += event.acceleration.y*2;
	//msg([move.x,move.y,move.z]);
	window.last_move = Object.assign({}, move);
}

