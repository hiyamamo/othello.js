var AREA_LENGTH = 8;
var board;

// 手番オブジェクト
var turn = function() {
	var player = "black";
	return {
		init: function(){
			player = "black";
		},
		changeTurn: function(){
			if(player === "black"){
				player = "white";
			}else{
				player = "black"
			}
		},
		getNowPlayer: function() {
			return player;
		},
		render: function(){
			document.getElementById("playerCol").innerHTML = turn.getNowPlayer();
		}
	};
}();

// 盤面オブジェクト
var initBoard = function(areaLength){
	// 全部で何個置けるか
	var squareNum = areaLength * areaLength - 4;
	// マスオブジェクトの配列
	var square = [];
	// 初期化
	for(var i = 0; i < areaLength; ++i){
		square[i] = [];
		for(var j = 0; j < areaLength; ++j){
			square[i][j] = {
				color: "none",
			};
		}
	}
	// 盤面上の石の初期配置
	var x = areaLength / 2;
	var y = areaLength / 2;
	square[x - 1][y - 1].color = "white";
	square[x][y - 1].color = "black";
	square[x -1][y].color = "black";
	square[x][y].color = "white";

	var change = function(pos, color){
	};

	// posに石を打てるかチェックして打てる場合はひっくり返る座標を返す
	var check = function(pos, color, dest, direction){
		var changes = [];
		var lengthX = null, lengthY = null;
		var length = null;

		// directionが0の場合はその方向をチェックしない
		if(direction.x !== 0){
			lengthX = Math.abs(pos.x - dest.x);
		}
		if(direction.y !== 0){
			lengthY = Math.abs(pos.y - dest.y);
		}

		// x,y 両方チェックする場合は短い方をlengthにセット
		// そうでない場合はnullじゃない方をセット
		if(lengthX !== null && lengthY !== null){
			length = lengthX <= lengthY ? lengthX : lengthY;
		}else{
			if(lengthX !== null){ length = lengthX; }
			if(lengthY !== null){ length = lengthY; }
		}

		if(length !== null){
			for(var i = 1; i <= length; i++){
				// 座標計算
				var x = pos.x + i * direction.x;
				var y = pos.y + i * direction.y;

				var sqCol = square[x][y].color;
				// none は即リターン
				if(sqCol === "none") { return null; }

				// 一個目で同じ色の場合も置けない
				if(i === 1 && sqCol === color) { return null; }

				// 同色までの座標を返す
				if(sqCol === color){
					return changes;
				}

				// 間にある座標を保存しておく
				changes.push( { x: x, y: y });
			}
		}
	};

	// ひっくり返る座標の配列を取得
	var getChanges = function(pos, color){
		if(square[pos.x][pos.y].color !== "none") {
			return [];
		}
		// 8方向
		var left =        { dest: { x: pos.x, y: 0                           }, direction: {x: 0, y: -1 } };
		var right =       { dest: { x: pos.x, y: areaLength - 1              }, direction: {x: 0, y: 1 } };
		var top =         { dest: { x: 0, y: pos.y                           }, direction: {x: -1, y: 0 } };
		var bottom =      { dest: { x: (areaLength - 1), y: pos.y            }, direction: {x: 1, y: 0 } };
		var leftTop =     { dest: { x: 0, y: 0                               }, direction: {x: -1, y: -1 } };
		var rightTop =    { dest: { x: 0, y: (areaLength - 1)                }, direction: {x: -1, y: 1 } };
		var leftBottom =  { dest: { x: (areaLength - 1), y: 0                }, direction: {x: 1, y: -1 } };
		var rightBottom = { dest: { x: (areaLength - 1), y: (areaLength - 1) }, direction: {x: 1, y: 1 } };
		var params = [ left, right, top, bottom, leftTop, rightTop, leftBottom, rightBottom ];

		var changes = [];
		for(var i = 0; i < 8; i++){
			var param = params[i];
			var c = check(pos, color, param.dest, param.direction);
			if(c){
				changes = changes.concat(c);
			}
		}
		return changes;
	};

	var update = function(color, changes){
		for(var i = 0; i < changes.length; ++i){
			var pos = changes[i];
			square[pos.x][pos.y].color = color;
		}
	};

	return {
		// 打つことが出来るマスを取得する
		getPossibles: function(color){
			var possibles = [];
			for(var i = 0; i < areaLength; ++i){
				for(var j = 0; j < areaLength; ++j){
					var changes = getChanges({ x: i, y: j }, color);
					if(changes.length !== 0){
						possibles.push({ x: i, y: j });
					}
				}
			}
			return possibles;
		},

		// 打つ座標が正しいか
		validate: function(pos, possibles){
			var sq = possibles.filter(function(item){
				if(item.x === pos.x && item.y === pos.y){
					return true;
				}
				return false;
			});
			if(sq.length > 0){
				return true;
			}
			return false;
		},

		// 石を置く
		put: function(pos, color){
			// ひっくり返る座標を取得して更新
			var changes = getChanges(pos, color);
			update(color, changes);
			square[pos.x][pos.y].color = color;
			squareNum -= 1;
		},

		// 描画
		render: function(){
			for(var i = 0; i < areaLength; ++i){
				for(var j = 0; j < areaLength; ++j){
					var id = "canvas," + i + "," + j;
					var canvas = document.getElementById(id);
					drawCircle(square[i][j].color, canvas);
				}
			}
		},

		// 終了か
		isFinish: function(){
			if(squareNum <= 0){
				return true;
			}
			return false;
		},
		// 結果計算
		calcResult: function(){
			var w = 0;
			var b = 0;
			for(var i = 0; i < areaLength; i++){
				for(var j = 0; j < areaLength; j++){
					if( square[i][j].color === "white" ){
						w++;
					}else if(square[i][j].color === "black"){
						b++;
					}
				}
			}
			if(w === b){
				return "Draw";
			}
			if(w > b){
				return "White Win";
			}
			if(w < b){
				return "Black Win";
			}
		}
	};
};

var drawCircle = function(color, target){
	if(color === "none"){ return ; }
	if(!target || !target.getContext) {
		return false;
	}
	var ctx = target.getContext('2d');
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(24, 24, 16, 0, Math.PI*2, false);
	ctx.fill();
};

var parseId = function(id){
	var s = id.split(",");
	return {
		x: parseInt(s[1]),
		y: parseInt(s[2])
	};
}

var onClick = function(e){
	if(e.target.tagName === "CANVAS"){
		var pos = parseId(e.target.id);
		var color = turn.getNowPlayer();
		var possibles = board.getPossibles(color);
		if(board.validate(pos, possibles)){
			board.put(pos, color);
			board.render();
			if(board.isFinish()){
				dispResult();
				return;
			}

			// ターンチェンジ後に置く場所があるかをチェック
			// 無ければ相手のターンへチェンジ後再びチェック
			// 両方共置く場所がない場合は結果を表示して終了
			turn.changeTurn();
			color = turn.getNowPlayer();
			possibles = board.getPossibles(color);
			if(possibles.length){
				turn.render();
				return;
			}
			alert("置く場所がない: " + color);

			turn.changeTurn();
			color = turn.getNowPlayer();
			possibles = board.getPossibles(color);
			if(possibles.length){
				turn.render();
				return;
			}

			alert("置く場所がない: " + color);
			dispResult();
		}
	}
};
var dispResult = function(){
	var result = board.calcResult();
	alert(result);
};

var initialize = function(){
	initTable(AREA_LENGTH);
	board = initBoard(AREA_LENGTH);
	board.render();
	turn.init();
	turn.render();
};

var load = function(){
	var table = document.getElementById("board");
	initialize();
	table.addEventListener("click", onClick, false);
	var button = document.getElementById("reload");
	// やり直しボタン
	button.addEventListener("click", function(){
		var table = document.getElementById("board");
		while(table.hasChildNodes()){
			table.removeChild(table.childNodes.item(0));
		}
		initialize();
	}, false);
};

// テーブル要素を初期化
var initTable = function(length){
	var t = document.getElementById("board");
	for(var i = 0; i < length; ++i){
		var tr = t.insertRow(t.rows.length);
		for(var j = 0; j < length; ++j){
			var td = tr.insertCell(tr.cells.length);
			td.style.backgroundColor = "#336633";
			var canvas = document.createElement("canvas");
			canvas.id = "canvas," + i + "," + j;
			canvas.width = "48";
			canvas.height = "48";
			td.appendChild(canvas);
		}
	}
};
document.addEventListener("DOMContentLoaded", load, false);
