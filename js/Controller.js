//ユーザの操作やセンサーによる動作
class Controller {
	constructor(){
		this.objs = [];
		this.value = {
			rotation : 
				{absolute: 0, alpha: 0, beta: Math.PI/2, gamma: 0},
			acceleration : 
				{x: 0, y: 0, z:0},
			common : []
		}
		this.init();
	}

	init(){
		if(window.DeviceOrientationEvent)
			window.addEventListener("deviceorientation", e => this.handleOrientation(e), true);

		if (window.DeviceMotionEvent) {
			window.last_move = {x: 0, y:0, z: 0};
			window.addEventListener('devicemotion', e => this.deviceMotionHandler(e));
		}
	}

	add(obj){ //数値を更新するオブジェクトを追加
		this.objs.push(obj);
	}

	addCommon(obj){ //同期させたい値
		return this.value.common.push(obj)-1;
	}

	updates(){
		for (var i = this.objs.length - 1; i >= 0; i--) {
			this.objs[i].update(this.value);
		}
	}

	// スマホデバイスによる傾き値
	handleOrientation(e){
		this.value.rotation.absolute	= e.absolute*Math.PI/180;
		this.value.rotation.alpha		= e.alpha*Math.PI/180;
		this.value.rotation.beta		= e.beta*Math.PI/180;
		this.value.rotation.gamma		= e.gamma*Math.PI/180;
	}

	// スマホデバイスによる加速度値
	deviceMotionHandler(e){
		//let move = {x: e.acceleration.x, y: e.acceleration.y, z: e.acceleration.z};
		this.value.acceleration = {x: e.acceleration.x*2, y: e.acceleration.y*2, z: e.acceleration.z*2};
		//window.last_move = Object.assign({}, move);
	}
}