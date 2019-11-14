class canvas2D {
	constructor(){
		let a2DCanvas = document.getElementById('a2DCanvas');
		this.g = a2DCanvas.getContext('2d');

		this.mouse = new THREE.Vector2(10,10);
		this.center = new THREE.Vector2(160,160);
		this.point = new THREE.Vector2(0.5,0.5);
		this.lockedPoint = new THREE.Vector2(0.5,0.5);
		this.radius = 100;

		this.objs = [];
		this.pts = [];
		this.lines = [];

		a2DCanvas.addEventListener("mousemove", function(e){
		// マウス位置を更新
		//getMousePosOnElement(e);
		// 描画
		//this.draw();

		}, false);
		this.draw();

	}

	add(obj){
		this.objs.push(obj);
	}

	setPoints(pts){
		this.pts = pts;
	}

	setLines(lines){
		this.lines = lines;
	}
	


/*	// 矢印の設定
	var arrowPos = function(A,B,w,h,h2,L,R,M){
		var Vx= B.x-A.x;
		var Vy= B.y-A.y;
		var v = Math.sqrt(Vx*Vx+Vy*Vy);
		var Ux= Vx/v;
		var Uy= Vy/v;
		L[0]= B.x - Uy*w - Ux*h;
		L[1]= B.y + Ux*w - Uy*h;
		R[0]= B.x + Uy*w - Ux*h;
		R[1]= B.y - Ux*w - Uy*h;
		M[0]= B.x - Ux*h2;
		M[1]= B.y - Uy*h2;
	}

	// 矢印の描画
	var drawArrow = function(A,B,w,h,h2,line,rgba){
		var L = new Array(2), R = new Array(2), M = new Array(2);
		arrowPos(A, B, w, h, h2, L, R, M);
		g.save();
		g.strokeStyle="rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+","+rgba[3]+")";
		g.fillStyle="rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+","+rgba[3]+")";
		g.lineWidth=line;
		g.beginPath();
		g.moveTo(A.x,A.y);
		g.lineTo(M[0],M[1]);
		g.stroke();
		g.lineWidth=3;
		g.beginPath();
		g.moveTo(L[0],L[1]);
		g.lineTo(B.x,B.y);
		g.lineTo(R[0],R[1]);
		g.lineTo(M[0],M[1]);
		g.closePath();
		g.fill();
		g.restore();
	};

	var dottedArrow = function(A,B,w,h,h2,line,rgba) {
		var L = new Array(2), R = new Array(2), M = new Array(2);
		arrowPos(A, B, w, h, h2, L, R, M);
		g.save();
		g.strokeStyle="rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+","+rgba[3]+")";
		g.fillStyle="rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+","+rgba[3]+")";
		g.lineWidth=line;
		

		var d = Math.sqrt(Math.pow(M[0] - A.x, 2) + Math.pow(M[1] - A.y, 2)); // 始点(p1)、終点(p2)間の距離(d)
		var rad = Math.atan2(B.y - A.y, B.x - A.x); // 始点(p1)を中心とした、終点(p2)までの角度(rad)
		var space = 10; // 点線の間隔
		var dotted = Math.round(d / space / 2);

		for (var i = 0; i < dotted; i++) {
			var p3x = Math.cos(rad) * space * (i * 2) + A.x;
			var p3y = Math.sin(rad) * space * (i * 2) + A.y;
			var p4x = Math.cos(rad) * space * (i * 2 + 1) + A.x;
			var p4y = Math.sin(rad) * space * (i * 2 + 1) + A.y;

			g.beginPath();
			g.moveTo(p3x, p3y);
			g.lineTo(p4x, p4y);
			g.stroke();
			g.closePath();
		}
		g.lineWidth=3;
		g.beginPath();
		g.moveTo(L[0],L[1]);
		g.lineTo(B.x,B.y);
		g.lineTo(R[0],R[1]);
		g.lineTo(M[0],M[1]);
		g.closePath();
		g.fill();
		g.restore();
	};
*/
	/*
	* マウス位置を取得
	* @param {Object} e
	*/
	getMousePosOnElement(e){
		var rect = e.target.getBoundingClientRect();
		if(e.clientX - rect.left > 320) return;
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
		point.set((mouse.x-center.x)/radius, (center.y-mouse.y)/radius);
		return mouse;
	};




	draw(p1, p2, p3){
		//console.log('>>>');
		let WIDTH = 320, HEIGHT = 320;
		let g = this.g;
		g.clearRect(0, 0, 640, 320);
		g.beginPath();
		g.fillStyle = 'rgb(255,255,255)';
		g.strokeStyle = 'rgb(00,00,255)';
		g.fillRect(0, 0, 320, 320);
		g.strokeRect(0,0,320, 320);
		g.beginPath();
		g.strokeStyle = 'rgb(180,180,180)';
		g.stroke();

		
		g.fillStyle = 'rgb(0,100,0)';
		g.font="20px sans-serif";
		//g.fillText("x : "+(100).toFixed(2), 8, 48)
		//g.fillText("x : "+(this.ctl.acceleration.x).toFixed(2), 8, 48);
		//g.fillText("y : "+(p2).toFixed(2), 8, 64);
		//g.fillText("z : "+(p3).toFixed(2), 8, 80);
		g.fillStyle = 'rgb(179,179,255)';
		g.rect( 0, 0, WIDTH, HEIGHT, Math.PI*2, false );
		g.fill();
		g.lineWidth = 6;
		g.strokeStyle = 'rgb(220,220,220)';
		g.stroke();

		g.fillStyle = 'rgb(255,255,0)';
		for (var i = 0; i < this.pts.length; i++) {
			g.beginPath();
			//console.log(100-this.pts[i].x*3+50, 100-this.pts[i].y*3);
			g.arc( WIDTH/2-this.pts[i].x*100, HEIGHT/2-this.pts[i].y*100, 5, 0, Math.PI*2, false );
			g.fill();
			g.closePath();
		}

		g.strokeStyle = 'rgb(255,0,0)';
		g.lineWidth = 2;
		for (var i = 0; i < this.lines.length; i++) {
			g.beginPath();
			g.moveTo(WIDTH/2-this.lines[i][0].x*100, HEIGHT/2-this.lines[i][0].y*100)
			g.lineTo(WIDTH/2-this.lines[i][1].x*100, HEIGHT/2-this.lines[i][1].y*100)
			//console.log(100-this.pts[i].x*3+50, 100-this.pts[i].y*3);
			//g.arc( , 5, 0, Math.PI*2, false );
			//g.fill();
			g.closePath();
			g.stroke();
		}

		/*for (var i = 0; i < this.objs.length; i++) {
			this.objs[i].draw();
		}*/
		g.closePath();
	}
}


	

