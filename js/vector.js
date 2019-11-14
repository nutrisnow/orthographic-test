/*
	方向ベクトルは　小文字 または 位置_位置 (位置→位置)
	位置ベクトルは　大文字
	単位ベクトルは　_uを付ける
	スカラーは　小文字
*/

var Vector3 = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.add = function(k, a) {
		return new Vector3(
			this.x * k + a.x,
			this.y * k + a.y,
			this.z * k + a.z 
		)
	}
	// ベクトルをスカラー倍
	this.scale = function(k) {
		return new Vector3(
			this.x * k,
			this.y * k,
			this.z * k 
		)
	}
	// AB = B-A
	this.sub = function(a) {
		return new Vector3(
			this.x - a.x,
			this.y - a.y,
			this.z - a.z 
		)
	}
	// 内積
	this.dot = function(a) {
		return this.x * a.x + this.y * a.y + this.z * a.z;
	}
	// 外積
	this.cross = function(a){
		return new Vector3(
			this.y * a.z - this.z * a.y,
			this.z * a.x - this.x * a.z,
			this.x * a.y - this.y * a.x
		)
	}

	// 2つのベクトルの角度
	this.angle = function(a, b){ //bが省略された時は0を基準に返す
		if (b == null) b = v.i; //x方向の単位ベクトル
		var flg = Math.atan(this.cross(a,b),this.dot(a,b)); //y成分に対して符号を判定する
		var agl = Math.acos(this.dot(a,b)/(this.length(a)*this.length(b)));
		if (flg<=0) {return agl;} else {return 2*Math.PI - agl ;}       
	}

	// 2つのベクトルの余弦
	this.cos = function(a){
		return this.dot(a) / (this.length * a.length);
	}
	// 2つのベクトルの角度
	this.rad = function(a){
		return Math.acos(this.cos(a));
	}



	this.length = Math.sqrt( this.dot(this) );
	this.normal = function(){
		return new Vector3(
			this.x / this.length,
			this.y / this.length,
			this.z / this.length
		)
	}
}


var geometry = function() {
	this.sphere = function(P, r) {
		console.log(P, r);
		// レイと球の当たり判定 (視線がオブジェクトの方に向いているか)
		this.hit = function(CAM, SCREEN) { // CAMはカメラ位置
			//SCREENは3D空間でのピクセルの絶対位置
			var CAM_P = P.sub(CAM);
			var d = CAM_P.dot(ray);
			if (d > 0.0) {
				// オブジェクトとレイの方向を合わせている(スカラーで比較するため)
				// 　RAYの現在地 ray_u*cosθ +CAM　←座標化
				var RAYNOW = ray_u.add(d, CAM);
				var RAYNOW_P = P.sub(RAYNOW);
				// レイと球の中心との距離が半径より短いかどうかを判定(レイが球の中かどうか)
				if (RAYNOW_P.length < r) {
					// 球に当たった場合の処理
				}
			}
		}
	}
}

var camera2 = function(eyePOS, lookatPOS, focus, fov, size) { // Vector3で受け取る
	// focus: 焦点距離, fov: 視野
	console.log(eyePOS, lookatPOS);
	// カメラ座標系
	this.screenW = size[0];
	this.screenH = size[1];
	this.eyePOS = eyePOS;
	this.lookatPOS = lookatPOS;
	this.focus = focus;
	this.fov = fov;
	// スクリーン座標系
	var screen = [];



	this.draw = function(x, y) {// x, yはスクリーン座標系
		// 座標変換 スクリーン座標->絶対座標
		var ray = screen[y][x]
		// 物体ごとに衝突処理
	}

	this.LookAt = function() {
		// 視点POSから対象POSへの方向単位ベクトルを求めて焦点距離倍する
		var w = this.screenW/2.0, h = this.screenH/2.0;
		console.log(this.lookatPOS);
		var EL = this.lookatPOS.sub(this.eyePOS);
		
		var EL_u = EL.normal();
		
		var F = EL_u.add(focus, new Vector3(0,0,0));
		var F_forward_u = EL_u; //視点前の単位ベクトル
		var tmp = EL_u.sub(new Vector3(0,-20,0));
		var F_right_u = F_forward_u.cross(tmp).normal(); //少しずらす
		console.log(F, EL_u, EL.u, EL);
		console.log(tmp, F_right_u, F_forward_u);
		tmp = F_right_u.cross(EL_u);
		var F_up_u = tmp.normal();


		var screenPOS = [], aspect = w/h*1.0, halfH = Math.tan((Math.PI * fov /180) /2.0);
		for (var i = -h; i < h; i++) {
			screenPOS[i+h] = [];
			for (var j = -w; j < w; j++) {
				nPOS =F_right_u.add(j, F_up_u.add(i, new Vector3(0,0,0))).add(1, F);;
				//nPOS = new Vector3(F_right_u.x *j, F_up_u.y * i, 0).add(1, F);
				//console.log(F_right_u, F_up_u, i, j, nPOS);
				 screenPOS[i+h][j+w] = [nPOS.x, nPOS.y, nPOS.z];


			}
		}
		data = {
			OF: F,
			FU: F_up_u.add(1, F),
			FR: F_right_u.add(1, F),
			FF: F_forward_u.add(1, F), 
			screenPOS4: [
				screenPOS[0][0],
				screenPOS[0][w*2-1],
				screenPOS[h*2-1][0],
				screenPOS[h*2-1][w*2-1]
			]
		};
		return [screenPOS, data];
		//console.log(screenPOS);

		// 焦点POSから対象POSへの方向単位ベクトルを左右上下にそれぞれ90度回転させてピクセル倍する
		// = 法線ベクトル
	}
	this.render = function(w, h) {
		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				this.draw(i, j);
			}
		}
	}
}



