//各種設定
var PICTURE_URL = "gazou.png";
var BLOCK_W = 150;
var BLOCK_H = 150;
var ROW_COUNT = 4;
var COL_COUNT = 4;
var NUM_BLOCKS = ROW_COUNT * COL_COUNT;

//上下左右の相対座標を定義したもの
var UDLR = [[0,-1],[0,1],[-1,0][1,0]];

//ゲーム全体で使う変数
var context, image;
var blocks = [];
var isLock;

//初期処理
function init(){
	//描画コンテキストの取得
	var canvas =
	document.getElementById("gameCanvas");
	if (!canvas.getContext) {
		alert("Canvasをサポートしていません。"); return;
	}
	context = canvas.getContext("2d");
	//マウスイベントの設定
	canvas.onmousedown = mouseHandler;
	//メイン画像を呼び出す
	image = new Image();
	image.src = PICTURE_URL;
	image.onload = initGame;
};

//ゲームを初期化
function initGame(){
	isLock = true;
	//パズルのブロックを作成する
	for (var i = 0; i < NUM_BLOCKS; i++) {
		blocks[i] = i;
	}
	//末尾を空きブロックとする
	blocks[NUM_BLOCKS - 1] = -1;
	drawPuzzle();
	//1秒後にシャッフルを開始する
	setTimeout(shufflePuzzle, 1000);
}

//パズルの各ピースをシャッフルする
function shufflePuzzle(){
	var scount = 20;
	var blank = NUM_BLOCKS - 1;
	//1回のみシャッフルを行う関数
	var shuffle = function(){
		scount--;
		if (scount <= 0){
			isLock = false;
			return;
		}
		var r, px, py, no;
		while (1){
			r = Math.floor(Math.random() * UDLR.length);
			px = getCol(blank) + UDLR[r][0];
			py = getRow(blank) + UDLR[r][1];
			if (px < 0 || px >= COL_COUNT) continue;
			if (py < 0 || py >= ROW_COUNT) continue;
			no = getIndex(px, py);
			break;
		}
		blocks[blank] = blocks[no];
		blocks[no] = -1;
		blank = no;
		drawPuzzle();
		setTimeout(shuffle, 100);
	};
	shuffle();
}

//パズルの画面を描画する
function drawPuzzle(){
	for (var i = 0; i < NUM_BLOCKS; i++) {
		//描画先座標を計算
		var dx = (i % COL_COUNT) * BLOCK_W;
		var dy = Math.floor(i / COL_COUNT) * BLOCK_H;
		//描画元座標を計算
		var no = blocks[i];
		if (no < 0){
			context.fillStyle = "#0000FF";
			context.fillRect(dx, dy, BLOCK_W, BLOCK_H);
		} else {
			var sx = (no % COL_COUNT) * BLOCK_W;
			var sy = Math.floor(no / COL_COUNT) * BLOCK_H;
			//画像の一部を切り取って描画
			context.drawImage(image,
				sx, sy, BLOCK_W, BLOCK_H,
				dx, dy, BLOCK_W, BLOCK_H);
		}
		//画像の枠を描画
		context.beginPath();
		context.strokeStyle = "white";
		context.lineWidth = 3;
		context.rect(dx, dy, BLOCK_W, BLOCK_H);
		context.stroke();
		context.closePath();
		//ブロック番号を描画する
		context.fillStyle = "white";
		context.font = "bold 40px Arial";
		var cx = dx + (BLOCK_W - 40) / 2;
		var cy = dy + BLOCK_H / 2;
		context.fillText(no, cx, cy);
	}
}

//マウスで移動先をクリックした時の処理
function mouseHandler(t){
	if(isLock) return;
	//タッチ座標の取得
	var px = t.offsetX, py = t.offsetY;
	if (px == undefined) {
		var p = t.currentTarget;
		px = t.layerX - p.offsetLeft;
		py = t.layerY - p.offsetTop;
	}
	//何番目のピースを動かしたいかを計算する
	var px2 = Math.floor(px / BLOCK_W);
	var py2 = Math.floor(py / BLOCK_H);
	var no = getIndex(px2, py2);
	//空白ブロックなら動かせない
	if (blocks[no] == -1) return;
	//上下左右に動かせるブロックがあるか確認
	for (var i = 0; i < UDLR.length; i++){
		var pt = UDLR[i];
		var xx = px2 + pt[0];
		var yy = py2 + pt[1];
		var no = getIndex(xx, yy);
		if (xx < 0 || xx >= COL_COUNT) continue;
		if (yy < 0 || yy >= ROW_COUNT) continue;
		if (blocks[no] == -1){
			blocks[no] = blocks[getIndex(px2, py2)];
			blocks[getIndex(px2, py2)] = -1;
			drawPuzzle();
			checkClear();
			break;
		}
	}
}

//クリアしたかどうかをチェックする
function checkClear(){
	var flag = true;
	for (var i = 0; i < (NUM_BLOCKS - 1); i++){
		if (blocks[i] != i){flag = false; break;}
	}
	if(flag){
		alert("ゲームクリアしました！");
		initGame();
	}
}

//列と行からブロック番号を調べる関数
function getIndex(col, row){
	return row * COL_COUNT + col;
}
function getCol(no){return no % COL_COUNT;}
function getRow(no){
	return Math.floor(no / COL_COUNT);
}











