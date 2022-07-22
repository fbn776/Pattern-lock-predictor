let cww = Math.min(window.innerWidth, window.innerHeight) * 0.8;

const { canvas, ctx, cx, cy, cw, ch } = setUpCanvas(s("#main"), cww, cww);
const lg = new Log();

const rows = 3,
	cols = 3;
const w = cw / cols,
	h = ch / rows;


var grid = [];
let paused = false;
let startCell;
let endCell;
let currCell;
let maxNoOfMoves;
let noOfMoves = 0;
//If the pattern move through specific IDs then, this var will handle that;
let betweens = [];
//Convert the position ID to position cords;
let betweens_temp = [];
//If the order matters then; will be using this;
let goByOrder = false;
//If the pattern doesn't move through specific IDs then, this var will handle that;
let restrictedIDs = [];
//Convert the position ID to position cords;
let restrictedPos = [];

let startDraw = false;
let finished = false;
let endCellObj;
let connected = [];

//Other variables; (constant vars that are defined at each run);
let arrowLen = 10;
let theta1 = rad(225);
let theta2 = rad(135);
let cos1 = arrowLen * Math.cos(theta1);
let sin1 = arrowLen * Math.sin(theta1);
let cos2 = arrowLen * Math.cos(theta2);
let sin2 = arrowLen * Math.sin(theta2);


function setVars(obj) {
	startCell = obj.startPos;
	endCell = obj.endPos;
	currCell = startCell;
	maxNoOfMoves = obj.noOfMove;
	betweens = obj.betweens || [];
	//betweens_temp = betweens.map(getPosFromID);
	goByOrder = obj.isInOrder;
	restrictedIDs = obj.restricted || [];
	restrictedPos = restrictedIDs.map(getPosFromID);
	startDraw = true;
}

function setup(obj) {
	grid = [];
	connected = [];
	noOfMoves = 0;
	currCell = startCell;
	betweens_temp = betweens.map(getPosFromID);
	finished = false;

	for (let i = 0; i < 9; i++) {
		let flag;
		if (i + 1 == startCell) {
			flag = "start";
		} else if (i + 1 == endCell) {
			flag = "end";
		} else if (restrictedIDs.includes(i + 1)) {
			flag = "restricted";
		} else if (betweens.includes(i + 1)) {
			flag = "pass";
		} else {
			flag = null;
		};

		grid.push({
			id: i + 1,
			pos: [i % 3, (i - (i % 3)) / 3], //(x,y) cord of the cell;
			isUsed: false,
			flagged: flag,
			connecteFrom: null,
			conmectedTo: null,
		});
	};
	endCellObj = grid[endCell - 1];
}

function initialDraw() {
	for (let j = 0; j < rows; j++) {
		for (i = 0; i < cols; i++) {
			ctx.circle((i * w) + (w / 2), (j * h) + (h / 2), 10, {
				fill: "black",
				color: "black",
				width: 2,
			});
			ctx.text((i * w) + w / 2 - 4, (j * h) + h / 2 + 4, (i + 3 * j) + 1, {
				color: "white",
				font: "14px monospace"
			});
		}
	};
};

function draw() {
	if (!paused && startDraw) {
		ctx.clearRect(0, 0, cw, ch);
		if (noOfMoves < maxNoOfMoves) {
			noOfMoves++;

			let currCellObj = grid[currCell - 1];
			currCellObj.isUsed = true;

			let x = currCellObj.pos[0];
			let y = currCellObj.pos[1];

			//Highlight the current cell;
			/*ctx.box(x * w, y * h, w, h, {
				fill: "rgba(0,200,0,0.1)",
				color: "green",
			})*/
			ctx.circle(x * w + w/2, y * h + h/2, 30, {
				fill: "rgba(0,150,0,0.2)",
				color: "green"
			})

			//All the position of a general neighboring block;
			let neighbors = [
				[x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
				[x - 1, y], [x + 1, y],
				[x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
			];

			/*Filter out the neighbors which are null and if no of moves if low, then dont include the final end cell*/
			neighbors = neighbors.filter((cell) => {
				let obj = getValueFromGrid(grid, cell[0], cell[1]);
				//If the object is null or is connected to, then filter it out;
				if (obj == null || obj.isUsed) {
					return false;
				}
				//If the current cell is in the restricted list, then filter it out;
				if (hasElmArray(restrictedPos, cell)) {
					return false;
				}
				//If the current cell is the end cell and no of moves is low, then filter it out;
				if ((obj.id == endCell) && (maxNoOfMoves - noOfMoves >= 1)) {
					return false;
				}

				if (goByOrder && hasElmArray(betweens_temp, cell) && !isArrEqual(cell, betweens_temp[0])) {
					return false;
				}
				return true;
			});
			//Do the next move, if a move exits;
			if (neighbors.length != 0) {

				/****I donno what this does. but im too afraid to remove this. *****/
				//If the neighbours have an user-known connection cell and the order is important, then delete known cells from neighbors that are not in the the first place of the order; 
				if (betweens_temp.length > 0 && goByOrder) {
					let intr = get2DInterscetion(neighbors, betweens_temp);
					if (intr.length == 1 && !isArrEqual(intr[0], betweens_temp[0])) {
						console.log("yes")
						neighbors = removedFrom2D(neighbors, intr[0]);
					}
				};

				//Check again if the neighbors are empty;
				if (neighbors.length != 0) {
					//Select a random next move at first;
					let nextMove = neighbors.randomItem();

					//If it is the last move and the neighbors has the end cell in it then, connect to it;
					if (betweens_temp.length == 0 && (maxNoOfMoves - noOfMoves <= 1) && hasElmArray(neighbors, endCellObj.pos)) {
						nextMove = endCellObj.pos;
						finished = true;
						//endCellObj.isUsed = true;
					} else {
						if (((maxNoOfMoves - noOfMoves) <= betweens_temp.length)) {
							let intr = get2DInterscetion(neighbors, betweens_temp);
							if (intr.length > 0) {
								if (goByOrder) {
									nextMove = getFirstElmFrom2Arr(betweens_temp, intr);
								} else {
									nextMove = intr.randomItem();
								}
								betweens_temp = removedFrom2D(betweens_temp, nextMove);
							}
						}
					}
					//A qucik fix; if the next move is randomly selected and the move is a betweens move, then remove the move from the betweens list;
					if (hasElmArray(betweens_temp, nextMove)) {
						betweens_temp = removedFrom2D(betweens_temp, nextMove);
					}

					let nextCellObj = getValueFromGrid(grid, nextMove[0], nextMove[1]);
					currCellObj.connectedTo = nextCellObj.id;
					nextCellObj.connectedFrom = currCellObj.id;

					currCell = nextCellObj.id;
					//Make the connection;
					connected.push([currCellObj.pos, nextCellObj.pos]);
				}
				else {
					noOfMoves = maxNoOfMoves;
				}
			} else {
				noOfMoves = maxNoOfMoves;
			}
		}

		//Draw the connection line;
		for (let elm of connected) {
			let a = elm[0],
				b = elm[1];
			ctx.line(a[0] * w + w / 2, a[1] * h + h / 2, b[0] * w + w / 2, b[1] * h + h / 2);

			//For drawing the direction arrows;
			let ratioM = 3;
			let ratioN = 2;
			let ratioSum = ratioM + ratioN;
			let centerX = ((w / 2) * ratioSum + w * (ratioM * a[0] + ratioN * b[0])) / ratioSum;
			let centerY = ((h / 2) * ratioSum + h * (ratioM * a[1] + ratioN * b[1])) / ratioSum;

			ctx.save();
			let angle = Math.atan2((b[1] - a[1]), (b[0] - a[0]));
			ctx.translate(centerX, centerY);
			ctx.rotate(angle);
			ctx.line(0, 0, cos1, sin1);
			ctx.line(0, 0, cos2, sin2);
			ctx.restore();
		}

		//Draw the circles, text and other stuff;
		for (let j = 0; j < rows; j++) {
			for (i = 0; i < cols; i++) {
				let obj = getValueFromGrid(grid, i, j);

				let fill;
				switch (obj.flagged) {
					case "start":
					case "end":
						fill = "blue";
						break;
					case "restricted":
						fill = "rgba(244, 67, 54, 0.5)";
						break;
					case "pass":
						fill = "green";
						break;
					default:
						fill = "black"
				}
				ctx.circle((i * w) + (w / 2), (j * h) + (h / 2), 10, {
					fill: fill,
					color: obj.isUsed ? "#607D8B" : "transparent",
					width: 2
				});
				ctx.text((i * w) + w / 2 - 4, (j * h) + h / 2 + 4, obj.id, {
					color: "white",
					font: "14px monospace"
				});
			}
		};

		//If max no of moves is reached and it is not finished, then restart;
		if (noOfMoves == maxNoOfMoves && !finished) {
			setup();
		}
	}
}
