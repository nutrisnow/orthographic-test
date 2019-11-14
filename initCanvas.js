window.addEventListener('load', ()=>{
	window.ctl = new Controller();
	window.c2d = new canvas2D();
	window.c3d = new canvas3D();
	window._n_ = {x:1,y:2,z:6}
	window._O_ = {x:1,y:1,z:3}
	s1(window.c3d);
	t1(window.c2d);
	tick();

	// 毎フレーム時に実行されるループイベントです
	function tick() {
		document.getElementById('a3DCanvas').style.cursor = 'auto';
		window.focus = null;
		ctl.updates();
		//var pos = camera.position;
		//console.log(pos);
		//console.log(window.camGeo0.position);
		// レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
		//raycaster.setFromCamera(mouse, camera);
		// その光線とぶつかったオブジェクトを得る
		c2d.draw();
		c3d.render();

		requestAnimationFrame(tick);
	}
});

function s1(c3d){
	let scene = c3d.scene;
	// 座標軸を表示
	let axes = new THREE.AxesHelper(25);
	scene.add(axes);

	//GridHelper(大きさ, １マスの大きさ)
	var grid = new THREE.GridHelper(1000, 100);
	grid.material.color = new THREE.Color( 0xffffff);
	grid.rotation.x = Math.PI/2;
	scene.add(grid); 

	

	let p = new Plane(scene);
	ctl.add(p);
	ctl.addCommon(p);

	


	let cube = new Cube(scene);
	ctl.add(cube);

	let ac = new ActiveCamera(c3d);
	ctl.add(ac);
}

function t1(c2d){
	let ag = new Graph2D(c2d);
	c2d.add(ag);
	ctl.add(ag);
}

class ActiveCamera {
	constructor(c3d){
		this.camera = c3d.camera;
		//this.camera.position.set(0,0,200);
	}
	update(ctl){
		//this.camera.rotation.set(ctl.rotation.beta, ctl.rotation.gamma, ctl.rotation.alpha);
		//console.log(this.camera.rotation);
	}
}
//c3d.scene(new THREE.ArrowHelper(this.dir, new THREE.Vector3(0,0,0), 30, 0xff0000, 8,3))

class Cube {
	constructor(scene){
		let cube = new THREE.LineSegments(
			new THREE.EdgesGeometry(new THREE.CubeGeometry(1,1,1)),                     
			new THREE.LineBasicMaterial({                                      
				color: 0x990000, //球の色
				//wireframe: true //ワイヤーフレーム有効
			})
		);
		cube.position.set(0.5,0.5,0.5);
		console.log(cube.geometry);
		scene.add(cube);

		let n, O, P, H, up, right;
		

		n = new THREE.Vector3(window._n_.x, window._n_.y, window._n_.z)//.normalize(); // 法線n
		O = new THREE.Vector3(window._O_.x, window._O_.y, window._O_.z); //平面の位置

		let WIDTH =1;
		let HEIGHT = 1;


		// 法線ベクトルと平面の点Oと空間中の点Pを入力　→　点Pと平面の交点(垂線の足)を出力
		const calcH = (n, O, P)=>{
			// 点Pが平面上の点だった場合はエラー
			let t = (-n.x*P.x +n.x*O.x -n.y*P.y +n.y*O.y -n.z*P.z +n.z*O.z) / (Math.pow(n.x,2)+ Math.pow(n.y,2)+ Math.pow(n.z,2));
			return new THREE.Vector3(P.x+t*n.x, P.y+t*n.y, P.z+t*n.z);
		}

		// 上方向と右方向のベクトルを作成
		P = new THREE.Vector3(0,0,O.z+1); // 平面の1点より少し上
		up = calcH(n, O, P).sub(O).normalize();
		right = up.clone().cross(n.normalize()).normalize();

		
		this.AS = [];
		this.MS = [];
		
		const calcXY = (pos, flg, i)=>{
			P = new THREE.Vector3(pos[0],pos[1],pos[2]); // 任意の点P
			H = calcH(n, O, P); // 垂線の足

			let OH = H.clone().sub(O);
			let px = right.dot(OH);
			let py = up.dot(OH);
			//scene.add(new THREE.ArrowHelper(OH.clone().normalize(), O, OH.length(), 0x00ffff, 0.4,0.15)) //点Hの位置
			let PH = H.clone().sub(P);
			if(flg){
				let A = new THREE.ArrowHelper(PH.clone().normalize(), P, PH.length(), 0x00ffff, 0.2,0.07);
				this.AS[i] = A;
				scene.add(A) //点Hの位置
				this.MS[i] = new THREE.Mesh(new THREE.SphereGeometry(0.06,20,20),new THREE.MeshBasicMaterial({color:0xffff00}))
				this.MS[i].position.copy(H);
				scene.add(this.MS[i]);
			}

			return new THREE.Vector2(px, py);
		}

		this.points = [
			[0,0,0],
			[0,0,1],
			[0,1,0],
			[0,1,1],
			[1,0,0],
			[1,0,1],
			[1,1,0],
			[1,1,1]
		];

		this.lines = [
			[[0,0,0],[0,0,1]],
			[[0,0,0],[0,1,0]],
			[[0,0,0],[1,0,0]],
			[[0,0,1],[0,1,1]],
			[[0,0,1],[1,0,1]],
			[[0,1,0],[0,1,1]],
			[[0,1,0],[1,1,0]],
			[[0,1,1],[1,1,1]],
			[[1,0,0],[1,0,1]],
			[[1,0,0],[1,1,0]],
			[[1,0,1],[1,1,1]],
			[[1,1,0],[1,1,1]]
		];


		this.ppoints = [];
		this.plines = [];

		for (var i = 0; i < this.points.length; i++) {
			this.ppoints.push(calcXY(this.points[i], true, i));
		}


		for (var i = 0; i < this.lines.length; i++) {
			this.plines.push([calcXY(this.lines[i][0], false), calcXY(this.lines[i][1], false)]);
		}

		/*points.push(calcXY(0,0,0));
		points.push(calcXY(0,0,1));
		points.push(calcXY(0,1,0));
		points.push(calcXY(0,1,1));
		points.push(calcXY(1,0,0));
		points.push(calcXY(1,0,1));
		points.push(calcXY(1,1,0));;
		points.push(calcXY(1,1,1));*/

		//c2d.setPoints(points);
		c2d.setLines(this.plines);
			
		this.n = n;
		this.O = O;
		this.P = P;
		this.H = H;
		this.up = up;
		this.right = right;
		
			//console.log(up.clone().sub(O).angleTo(right)*180/Math.PI);
		scene.add(this.AN = new THREE.ArrowHelper(n.normalize(), O, 1, 0xff0000, 0.4,0.15))	//法線ベクトル
		scene.add(this.AR = new THREE.ArrowHelper(right, O, WIDTH, 0x00ff00, 0.4,0.15))		//水平ベクトル
		scene.add(this.AT = new THREE.ArrowHelper(up, O, HEIGHT, 0x0000ff, 0.4,0.15))			//垂直ベクトル

		console.log(this.AS)
	}

	update(ctl){
		let n = new THREE.Vector3(window._n_.x, window._n_.y, window._n_.z)
		let O = new THREE.Vector3(window._O_.x, window._O_.y, window._O_.z); //平面の位置
		let P = this.P
		let H = this.H;
		let up = this.up;
		let right = this.right;


		//console.log(this.n, this.O);

		// 法線ベクトルと平面の点Oと空間中の点Pを入力　→　点Pと平面の交点(垂線の足)を出力
		const calcH = (n, O, P)=>{
			//console.log(n, O, P);
			// 点Pが平面上の点だった場合はエラー
			let t = (-n.x*P.x +n.x*O.x -n.y*P.y +n.y*O.y -n.z*P.z +n.z*O.z) / (Math.pow(n.x,2)+ Math.pow(n.y,2)+ Math.pow(n.z,2));
			return new THREE.Vector3(P.x+t*n.x, P.y+t*n.y, P.z+t*n.z);
		}

		const calcXY = (pos, flg, i)=>{
			//console.log(n, O);
			let P = new THREE.Vector3(pos[0],pos[1],pos[2]); // 任意の点P
			let H = calcH(n, O, P); // 垂線の足

			let OH = H.clone().sub(O);
			let px = right.dot(OH);
			let py = up.dot(OH);
			let PH = H.clone().sub(P);
			if(flg) {
				this.AS[i].setDirection(PH.clone().normalize());
				this.AS[i].setLength(PH.length());
				this.MS[i].position.copy(H);
				//console.log(H);
			}
			//if(i) this.AS[i].setLength(OH.length());
			//scene.add(new THREE.ArrowHelper(OH.clone().normalize(), O, OH.length(), 0x00ffff, 0.4,0.15)) //点Hの位置

			return new THREE.Vector2(px, py);
		}

		// 上方向と右方向のベクトルを作成
		P = new THREE.Vector3(O.x,O.y,O.z+0.001); // 平面の1点より少し上
		up = calcH(n, O, P).sub(O).normalize();
		right = up.clone().cross(n.normalize()).normalize();

		for (var i = 0; i < this.points.length; i++) {
			this.ppoints.push(calcXY(this.points[i], true, i));
		}

		this.plines = [];
		for (var i = 0; i < this.lines.length; i++) {
			this.plines.push([calcXY(this.lines[i][0], false), calcXY(this.lines[i][1], false)]);
		}
		c2d.setLines(this.plines);
		this.AN.setDirection(n.normalize());this.AN.position.copy(O)
		this.AR.setDirection(right);this.AR.position.copy(O)
		this.AT.setDirection(up);this.AT.position.copy(O)
		//console.log(O);
		//this.AN.setLength(ttt);
	}
}

class Plane {
	constructor(scene){

		this.n =  new THREE.Vector3(window._n_.x, window._n_.y, window._n_.z);
		this.pos = new THREE.Vector3(1,1,3.1);

		this.obj = new THREE.Mesh(
			new THREE.PlaneGeometry ( 5, 5 , 1, 1),
			new THREE.MeshBasicMaterial({ 
				color: 0x0000ff,
				opacity:0.3,
				transparent: true,
				side: THREE.DoubleSide
			})
		);
		//this.dir = new THREE.Vector3(1,2,-1);
		this.obj.position.copy(this.pos);
		//this.obj.lookAt(this.n.clone().add(new THREE.Vector3(0,0,0)));
		scene.add(this.obj); 
		//「上」方向のベクトルを生成。サンプルでは「空」方向。
		var up = new THREE.Vector3(0, 0, 1);

		//法線ベクトルを取得。サンプルではinput要素から取得。
		var normalAxis = this.n.normalize();

		//回転軸用のベクトルを生成
		var dir = new THREE.Vector3();

		//「上」方向と法線ベクトルとの外積を計算。正規化。
		dir.crossVectors(up, normalAxis).normalize();

		//上記ベクトルとの内積（cosθ）
		var dot = up.dot(normalAxis);// / (up.length() * normalAxis.length());

		//acos関数を使ってラジアンに変換。
		var rad = Math.acos(dot);

		//クォータニオンオブジェクトを生成
		var q = new THREE.Quaternion();

		//計算した回転軸と角度を元にクォータニオンをセットアップ
		q.setFromAxisAngle(dir, rad);

		//適用したいオブジェクトに回転を適用
		this.obj.rotation.setFromQuaternion(q);

		

	}

	update(ctl){
		this.n =  new THREE.Vector3(window._n_.x, window._n_.y, window._n_.z);
		this.obj.position.copy(new THREE.Vector3(window._O_.x, window._O_.y, window._O_.z));
		var up = new THREE.Vector3(0, 0, 1);
		var normalAxis = this.n.normalize();
		var dir = new THREE.Vector3();
		dir.crossVectors(up, normalAxis).normalize();
		var dot = up.dot(normalAxis);// / (up.length() * normalAxis.length());
		var rad = Math.acos(dot);
		var q = new THREE.Quaternion();
		q.setFromAxisAngle(dir, rad);
		this.obj.rotation.setFromQuaternion(q);
	}

}


	//scene.add(plane.obj); 
	//arraw(plane.pos, plane.tgt, 20);



class Graph2D {
	constructor(c2d){
		this.g = c2d.g;
		this.val = {x: 0, y:0, z: 0};
		this.vals = [];
		for (var i = 0; i < 150; i++) {
			this.vals.push({x:0, y:0, z: 0});
		}
		
		console.log(c2d);
	}

	draw(val){
		
		let g = this.g;
		
		/*g.font="20px sans-serif";
		g.beginPath();
		g.fillStyle = 'rgb(255,255,0)';
		g.arc( 10, 10, 5, 0, Math.PI*2, false );
		g.fill();
		//g.stroke();
		//g.closePath();*/

	}

	update(ctl){
		//console.log(ctl);
		this.val = {x: ctl.acceleration.x, y: ctl.acceleration.y, z: ctl.acceleration.z };
		//this.val = {x: ctl.rotation.alpha, y: ctl.rotation.beta, z: ctl.rotation.gamma };
	}
}



var arraw =  function(origin, destination, length) { //THREE.Vector3

		const O = origin, D = destination;
		const OD = new THREE.Vector3().subVectors(D, O);
		let len;
		if(length) len = length;
		else len = OD.length();
		let arrowHelper = new THREE.ArrowHelper(OD.clone().normalize(), O, len, 0xff0000, 8,3);
		//console.log(arrowHelper.cone.scale);
		//arrowHelper.cone.scale.set(20,20,20);
		//console.log(arrowHelper.cone.scale);
		scene.add( arrowHelper );
		return arrowHelper;
}
