var AREA_LENGTH = 8;


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
	var squareNum = areaLength * areaLength - 4;
	var possibleSquare = [];
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

	var willChangeTbl = [];

	var change = function(pos, color){
		square[pos.x][pos.y].color = color;
	};

	var checkTop = function(pos, color){
		var temp = [];
		if(pos.x === 0){ return; }
		for(var i =(pos.x - 1); i >= 0; --i){
			var sqCol = square[i][pos.y].color;
			if(sqCol === "none"){ return; }
			if( (i === (pos.x-1)) && (sqCol === color) ){ return; }
			if(sqCol === color){
				willChangeTbl = willChangeTbl.concat(temp);
				return;
			}
			temp.push( { x: i, y: pos.y } );
		}
	};

	var checkBottom = function(pos, color){
		var temp = [];
		var initial = pos.x + 1;
		for(var i = initial; i < areaLength; ++i){
			var sqCol = square[i][pos.y].color;
			if(sqCol === "none"){ return; }
			if(i === initial && sqCol === color){ return; }
			if(sqCol === color){
				willChangeTbl = willChangeTbl.concat(temp);
			}
			temp.push( { x: i, y: pos.y } );
		}
	};

	var checkLeft = function(pos, color){
		if(pos.y === 0){ return; }
		var temp = [];
		for(var i = pos.y - 1; i >= 0; --i){
			var sqCol = square[pos.x][i].color;
			if(sqCol === "none") { return; }
			if(i === pos.y - 1 && sqCol === color){ return; }
			if(sqCol === color){
				willChangeTbl = willChangeTbl.concat(temp);
				return;
			}
			temp.push( { x: pos.x, y: i } );
		}
	};

	var checkRight = function(pos, color){
		var temp = [];
		var initial = pos.y + 1;
		for(var i = initial; i < areaLength; ++i){
			var sqCol = square[pos.x][i].color; 
			if(sqCol === "none" ) { return; }
			if(i === initial && sqCol === color) { return; }
			if(sqCol === color){
				willChangeTbl = willChangeTbl.concat(temp);
				return;
			}
			temp.push( { x: pos.x, y: i } );
		}
	};

	var checkLeftTop = function(pos, color){
		var possibleSquare = [];
		if(pos.x === 0 || pos.y === 0) { return; }
		var temp = [];
		var initialX = pos.x - 1;
		var initialY = pos.y - 1;
		for(var i = initialX, j = initialY; i >= 0 && j >= 0; --i, --j){
			var sqCol = square[i][j].color;
			if(sqCol === "none"){ return; }
			if(i === initialX && j === initialY && sqCol === color) { return; }
			if(sqCol === color){
				willChangeTbl = willChangeTbl.concat(temp);
				return;
			}
			temp.push( { x: i, y: j } );
		}
	};

	var checkLeftBottom = function(pos, color){
		if(pos.y === 0) { return; }
		var temp = [];
		var initialX = pos.x + 1
		var initialY = pos.y - 1;
		for(var i = initialX, j = initialY; i < areaLength && j >= 0; ++i, --j){
			var sqCol = square[i][j].color;
			if(sqCol === "none") { return; }
			if(i === initialX && j === initialY && sqCol === color){ return; }
			if(sqCol === color){
				willChangeTbl = willChangeTbl.concat(temp);
				return;
			}
			temp.push( { x: i, y: j });
		}
	};

	var checkRighTop = function(pos, color){
		if(pos.x === 0) { return; }
		var temp = [];
		var initialX = pos.x - 1;
		var initialY = pos.y + 1;
		for(var i = initialX, j = initialY; i >= 0 && j < areaLength; --i, ++j){
			var sqCol = square[i][j].color;
			if(sqCol === "none") { return; }
			if(i === initialX && j === initialY && sqCol === color){ return; }
			if(sqCol === color){
				willChangeTbl = willChangeTbl.concat(temp);
				return;
			}
			temp.push( { x: i, y: j } );
		}
	};

	var checkRightBottom = function(pos, color){
		var temp = [];
		var initialX = pos.x + 1;
		var initialY = pos.y + 1;
		for(var i = initialX, j = initialY; i < areaLength && j < areaLength; ++i, ++j){
			var sqCol = square[i][j].color;
			if(sqCol === "none") { return; }
			if( i === initialX & j === initialY && sqCol === color) { return; }
			if(sqCol === color){
				willChangeTbl = willChangeTbl.concat(temp);
				return;
			}
			temp.push( { x: i, y: j });
		}
	};
	var check = function(pos, color){
		if(square[pos.x][pos.y].color !== "none") {
			return false;
		}
		checkLeft(pos, color);
		checkRight(pos, color);
		checkTop(pos, color);
		checkBottom(pos, color);
		checkLeftTop(pos, color);
		checkRighTop(pos, color);
		checkLeftBottom(pos, color);
		checkRightBottom(pos, color);
		if(willChangeTbl.length === 0) {
			return false;
		}
		return true;
	};

	return {
		// 打つことが出来るマスを配列にセットする
		setPossibleSquare: function(color){
			possibleSquare = [];
			willChangeTbl = [];
			for(var i = 0; i < areaLength; ++i){
				for(var j = 0; j < areaLength; ++j){
					if(check({x: i, y: j } , color)){
						possibleSquare.push({ x: i, y: j });
						willChangeTbl = [];
					}
				}
			}
		},
		// 打つことが出来るマスがあるか
		existPossibleSquare: function(){
			if(possibleSquare.length !== 0){
				return true;
			}
			return false;
		},

		// 打つ座標が正しいか
		validate: function(pos){
			var sq = possibleSquare.filter(function(item){
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
			check(pos, color);
			square[pos.x][pos.y].color = color;
			squareNum -= 1;
		},

		update: function(color){
			for(var i = 0; i < willChangeTbl.length; ++i){
				change(willChangeTbl[i], color);
			}
		},

		render: function(){
			for(var i = 0; i < areaLength; ++i){
				for(var j = 0; j < areaLength; ++j){
					var id = "canvas," + i + "," + j;
					var canvas = document.getElementById(id);
					drawCircle(square[i][j].color, canvas);
				}
			}
		},

		isFinish: function(){
			if(squareNum <= 0){
				return true;
			}
			return false;
		},
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

var board;
var onClick = function(e){
	if(e.target.tagName === "CANVAS"){
		var pos = parseId(e.target.id);
		var color = turn.getNowPlayer();
		board.setPossibleSquare(color);
		if(board.validate(pos)){
			board.put(pos, color);
			board.update(color);
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
			board.setPossibleSquare(color);
			if(board.existPossibleSquare()){
				turn.render();
				return;
			}
			alert("置く場所がない: " + color);

			turn.changeTurn();
			color = turn.getNowPlayer();
			board.setPossibleSquare(color);
			if(board.existPossibleSquare()){
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
