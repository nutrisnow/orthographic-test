class canvas3D {
	constructor(){
		// canvas element
		const a3DCanvas = document.querySelector('#a3DCanvas');
		this.a3DCanvas = a3DCanvas;

		// scene size
		const WIDTH = window.innerWidth;
		const HEIGHT = window.innerHeight;

		// camera
		const VIEW_ANGLE = 45;
		const ASPECT = WIDTH / HEIGHT;
		const NEAR = 0;
		const FAR = 500;
		const rot = 0; // 角度
		const mouseX = 0; // マウス座標

		// カメラを作成
		const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT);
		this.camera = camera;
		//camera.useQuaternion = true;
		camera.position.set( 0, 0, 10 );
		camera.fov = 60; 
		camera.up.set(0, 0, 1);

		// サブカメラを作成
		const subCamera = new THREE.OrthographicCamera(-480, +480, 270, -270, 1, 1000);;
		this.subCamera = subCamera;
		subCamera.position.set( 0, 0, 600 );
		subCamera.fov = 60; 
		subCamera.up.set(0, 0, 1);

		// カメラコントローラーを作成
		const controls = new THREE.OrbitControls(this.camera, a3DCanvas);

		// マウス座標管理用のベクトル
		this.mouse = new THREE.Vector2();

		const raycaster = new THREE.Raycaster();

		// シーンを作成
		this.scene = new THREE.Scene();

		// レンダラーを作成
		const renderer = new THREE.WebGLRenderer({
			canvas: a3DCanvas,
			antialias: true
		});
		this.renderer = renderer;
		renderer.autoClear = false;
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0xffffff, 1.0);
		renderer.setSize(WIDTH, HEIGHT);

		
		// イベントリスナ登録
		window.addEventListener('resize', e => this.resize(e));
		a3DCanvas.addEventListener('mousemove', e => this.mousemove(e), false);
		this.resize();
	}



	
	mousemove(e){
		const element = e.currentTarget;
		// canvas要素上のXY座標
		const x = e.clientX;
		const y = e.clientY;
		// canvas要素の幅・高さ
		const w = element.offsetWidth;
		const h = element.offsetHeight;

		// -1〜+1の範囲で現在のマウス座標を登録する
		this.mouse.set( ( x / w ) * 2 - 1, -( y / h ) * 2 + 1);
	}

	resize(e){
		// サイズを取得
		const SCREEN_WIDTH = document.documentElement.clientWidth;
		const SCREEN_HEIGHT = document.documentElement.clientHeight;
		this.SCREEN_WIDTH = SCREEN_WIDTH;
		this.SCREEN_HEIGHT = SCREEN_HEIGHT;

		// レンダラーのサイズを調整する
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);



		// 縮尺
		if (SCREEN_WIDTH > SCREEN_HEIGHT)
			var scale = 300 / SCREEN_WIDTH;
		else
			var scale = 300 / SCREEN_HEIGHT;

		// カメラのアスペクト比を正す
		this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
		this.camera.updateProjectionMatrix();

		this.a3DCanvas.addEventListener('click', function(){
				if(window.focus !== null) alert(window.focus.name);
		}, false )
	}
	
	
	render(){
		// 左画面
		//this.renderer.setViewport( 1, 1,   0.5 * width - 2, height - 2 );

		//右画面      
		//this.renderer.setViewport( 0.5 * SCREEN_WIDTH + 1, 1,   0.5 * SCREEN_WIDTH - 2, SCREEN_HEIGHT - 2 );
		//this.renderer.render( c3d.scene, c3d.subCamera );
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera); // レンダリング;
	}
	


	
	
	

	//let an = arraw(new THREE.Vector3(0,0,0), new THREE.Vector3(50,50,0), 10);
	//console.log(an);


	






	
}


var meshArray = [];

	
/*




	 



*/



function createCylinder(x0,y0,z0,r0, x1,y1,z1,r1, col, open) // 始点, 終点, 色, 太さ
{
var v = new THREE.Vector3(x0-x1, y0-y1, z0-z1);
var len = v.length();
var material = new THREE.MeshBasicMaterial({ color:col, ambient:col, opacity:1.0 });
var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, len, 0, 0, open), material);
cylinder.overdraw = true;

if (len > 0.001) {
cylinder.rotation.z = Math.acos(v.y/len);
cylinder.rotation.y = 0.5*Math.PI + Math.atan2(v.x, v.z);
cylinder.eulerOrder = 'YZX';
}

cylinder.position.x = (x1+x0)/2;
cylinder.position.y = (y1+y0)/2;
cylinder.position.z = (z1+z0)/2;

return cylinder;
}

function drawLine(O, P, col, weight) // 始点, 終点, 色, 太さ
{
var v = new THREE.Vector3().subVectors(O, P);
var len = v.length();

var material = new THREE.MeshBasicMaterial({ color:col, opacity:1.0 });
var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(weight, weight, len, 0, 0, false), material);
cylinder.overdraw = true;

if (len > 0.001) {
cylinder.rotation.z = Math.acos(v.y/len);
cylinder.rotation.y = 0.5*Math.PI + Math.atan2(v.x, v.z);
//cylinder.eulerOrder = 'YZX';
}

cylinder.position.copy(new THREE.Vector3().addVectors(O,P).divideScalar(2));
return cylinder;
}

function drawCube(S, POS, col, weight){

	var P0 = new THREE.Vector3(S.x/2.0, S.y/2.0, S.z/2.0);
	var P1 = new THREE.Vector3(S.x/2.0, S.y/2.0, -S.z/2.0);
	var P2 = new THREE.Vector3(S.x/2.0, -S.y/2.0, S.z/2.0);
	var P3 = new THREE.Vector3(S.x/2.0, -S.y/2.0, -S.z/2.0);
	var P4 = new THREE.Vector3(-S.x/2.0, S.y/2.0, S.z/2.0);
	var P5 = new THREE.Vector3(-S.x/2.0, S.y/2.0, -S.z/2.0);
	var P6 = new THREE.Vector3(-S.x/2.0, -S.y/2.0, S.z/2.0);
	var P7 = new THREE.Vector3(-S.x/2.0, -S.y/2.0, -S.z/2.0);


	var edge = new THREE.Group();
	edge.add(drawLine(P0, P1, col, weight));
	edge.add(drawLine(P0, P2, col, weight));
	edge.add(drawLine(P0, P4, col, weight));
	edge.add(drawLine(P1, P3, col, weight));
	edge.add(drawLine(P1, P5, col, weight));
	edge.add(drawLine(P2, P6, col, weight));
	edge.add(drawLine(P2, P3, col, weight));
	edge.add(drawLine(P3, P7, col, weight));
	edge.add(drawLine(P4, P5, col, weight));
	edge.add(drawLine(P4, P6, col, weight));
	edge.add(drawLine(P5, P7, col, weight));
	edge.add(drawLine(P6, P7, col, weight));
	edge.position.set(POS.x, POS.y, POS.z);


	return edge;
}


	
var carjson = [
	[
		[0,0,0],
		[0,0,0],
		[0, 0],
		[60, 0],
		[60, 16.7],
		[46.65, 16.7],
		[40, 30],
		[0, 30],
		[0, 0]
	],
	[
		[-Math.PI/2,0,0],
		[0,30,0],
		[0, 0],
		[0, 40],
		[40, 40],
		[40, 0],
		[0, 0]
	],
	[
		[-Math.PI/2,Math.PI*0.3525,0],
		[40,30,0],
		[0, 0],
		[0, 40],
		[15, 40],
		[15, 0],
		[0, 0]
	],
	[
		[-Math.PI/2,0,0],
		[46.6,16.7,0],
		[0, 0],
		[0, 40],
		[13.4, 40],
		[13.4, 0],
		[0, 0]
	],
	[
		[-Math.PI/2,Math.PI/2,0],
		[60,16.7,0],
		[0, 0],
		[0, 40],
		[16.7, 40],
		[16.7, 0],
		[0, 0]
	],
	[
		[-Math.PI/2,-Math.PI/2,0],
		[0,0,0],
		[0, 0],
		[0, 40],
		[30, 40],
		[30, 0],
		[0, 0]
	],
	[
		[0,0,0],
		[8,17,1],
		[0, 0],
		[0, 10],
		[15, 10],
		[15, 0],
		[0, 0]
	],
	[
		[0,0,0],
		[28,17,1],
		[0, 0],
		[0, 10],
		[11, 10],
		[15, 2],
		[15, 0],
		[0, 0]
	]
]