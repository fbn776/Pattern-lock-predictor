function s(x) {
	return document.querySelector(x)
}

function Log() {
	this.elm = document.createElement("div");
	document.body.appendChild(this.elm);
	this.elm.style = "position: fixed; top: 0; left: 0; padding: 5px; z-index: 99999; background-color: rgba(255,255,255,0.4); color: black; max-width: 100%; overflow: scroll "

	this.log = function() {
		this.elm.innerHTML = "";
		for (let a of arguments) {
			this.elm.innerHTML += a + "<br>";
		}
	}
}

function jsonS(x) {
	return JSON.stringify(x);
};

function jsonP(x) {
	return JSON.parse(x);
};


//Maths functions
function rad(x) {
	return (Math.PI / 180) * x;
};

function deg(x) {
	return (180 / Math.PI) * x;
};

function random(x, y, round = false) {
	let r = round ? Math.floor(Math.random()) : Math.random();
	return x + r * (y - x);
}

Array.prototype.randomItem = function() {
	return this[Math.floor(Math.random() * this.length)];
};


function intersection(A, B) {
	return A.filter(value => B.includes(value));
}

/**
 * Gets a value from a 1D array that is being used as an 2D grid using Cartesian coordinates
 * @param {Array} arr the to get values from;
 * @param {int} x the x-coordinate of the value;
 * @param {int} y the y-coordinate of the value;
 * @return {any} returns the value at (x,y);
 */
function getValueFromGrid(arr, x, y, rows = 3, cols = 3) {
	if (x >= rows || x < 0 || x > cols || y < 0 || y > rows) {
		return null;
	}
	return grid[x + (cols * y)];
}

/**
 * Checks if a 2D array has a specific array as it element
 * @param {Array} array Source array;
 * @param {Array} elm The array to look for;
 * @return {boolean} return if the arr exits in data;
 */
function hasElmArray(array, elm) {
	return array.some(e => Array.isArray(e) && e.every((o, i) => Object.is(elm[i], o)));
}

/**
 * Returns the intersection of two arrays
 */
function intersection(A, B) {
	return A.filter(value => B.includes(value));
}

/**
 * Returns the intersection of two 2D array (array in array) [An extension of intersection()]
 */
function get2DInterscetion(A, B) {
	return A.filter(function(val) {
		return hasElmArray(B, val);
	})
}

/**
 *Gets the position in the grid from the ID of a point(ID starts from 1 and ends at 9)
 */
function getPosFromID(id) {
	id--;
	return [id % 3, (id - (id % 3)) / 3];
}

function getSqDistBw(pos1, pos2) {
	return ((pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2);
}

/**
 * Checks if two arrays of type [a1,a2] and [b1,b2] are equal;
 */
function isArrEqual(a, b) {
	return a[0] == b[0] && a[1] == b[1];
}

/**
 * A function to remove element(s) of type [xn,yn] from a [[x1,y1]..[xn,yn]] type array
 */
function removedFrom2D(arr, item) {
	return arr.filter((val) => {
		return !isArrEqual(item, val);
	});
};

/**
 * Returns the first item of sortedArr with another arr
 */
function getFirstElmFrom2Arr(sortedArr, arr) {
	for (let a of sortedArr) {
		for (let b of arr) {
			if (isArrEqual(a, b)) {
				return a;
			}
		}
	}
}

/**
 * Check if an array has duplicate values inside it
 */
function hasDuplicates(array) {
	return (new Set(array)).size != (array.length);
}

function capInput(elm) {
	if (elm.value != "") {
		let min = parseFloat(elm.min) || 1;
		let max = parseFloat(elm.max) || 9;
		elm.value = parseInt(elm.value);
		elm.value = elm.value > max ? max : elm.value < min ? min : elm.value;
	}
}

function isInt(str) {
	return !isNaN(str) && Number.isInteger(parseFloat(str));
}

const width = window.innerWidth;
const height = window.innerHeight;
const twoPi = 2 * Math.PI;

function setUpCanvas(c, w, h) {
	c.width = w;
	c.height = h;
	return {
		canvas: c,
		ctx: c.getContext("2d"),
		cw: c.width,
		ch: c.height,
		cx: c.width / 2,
		cy: c.height / 2
	}
}

CanvasRenderingContext2D.prototype.line = function(x1, y1, x2, y2, opt = {}) {
	this.beginPath();
	if (opt.dash || opt.dashed) {
		this.setLineDash(opt.dash || opt.dashed || [5, 2]);
	}
	this.strokeStyle = (opt.color || opt.strokColor || "black");
	this.lineWidth = (opt.width || opt.lineWidth || 1);
	this.moveTo(x1, y1);
	this.lineTo(x2, y2);
	this.stroke();
	this.setLineDash([0, 0])
	this.closePath();
};

CanvasRenderingContext2D.prototype.circle = function(x, y, r, opt = {}) {
	this.beginPath();
	this.strokeStyle = (opt.color || opt.strokeStyle || opt.borderColor || "black");
	this.fillStyle = (opt.fill || opt.fillColor || opt.bg || opt.bgColor || "black");
	this.lineWidth = (opt.width || opt.lineWidth || opt.borderWidth || 1);
	this.arc(x, y, r, 0, twoPi);
	this.fill();
	this.stroke();
	this.closePath();
};

CanvasRenderingContext2D.prototype.text = function(x, y, txt, opt = {}) {
	this.beginPath();
	this.font = opt.font || "10px Arial";
	this.fillStyle = opt.color || "black"
	this.fillText(txt, x, y);
	this.closePath();
};

/********Code for the UI stuff*********/

//Check the betweens and restricted text for errors;
function checkAtListStr(val) {
	let l = val.split(",");
	for (let i = 0; i < l.length; i++) {
		if (i == l.length - 1 && l[i] == "") {
			break;
		}
		if (!isInt(l[i])) {
			return {
				status: false,
				index: i,
				value: l[i] == "" ? "<no value>" : l[i],
				error: "Not an integer"
			}
		} else {
			if (parseInt(l[i]) > 9 || parseInt(l[i]) < 1) {
				return {
					status: false,
					index: i,
					value: l[i],
					error: "Out of bound, values should be between 1 and 9"
				}
			}
		}
	};
	return {
		status: true,
		list: l.map(parseFloat),
	}
}
//Check if the data given by the user is valid;
function checkForEverything(obj, text1, text2) {
	let data = {
		betweens: [],
		restricted: []
	};

	if (!obj.startPos) {
		alert("Starting position cannot be empty");
		return false;
	}
	if (!obj.endPos) {
		alert("Ending position cannot be empty");
		return false;
	}
	if (obj.startPos == obj.endPos) {
		alert("Starting position and ending positions cannot be of the same value")
		return false;
	}
	let b_w = restri = {};
	if (obj.betweens) {
		b_w = checkAtListStr(obj.betweens);
		if (!b_w.status) {
			alert(`Error at: value '${b_w.value}' at index '${b_w.index}' of pass through values \nReason: ${b_w.error}`)
			return false;
		};
		if (hasDuplicates(b_w.list)) {
			let removeIt = confirm("Pass through values has duplicate values inside it.\n\nDo you want to delete duplicate values?");
			if (removeIt) {
				b_w.list = Array.from(new Set(b_w.list));
				text1.value = b_w.list;
			} else {
				return false;
			}
		};
		if (b_w.list.includes(obj.startPos) || b_w.list.includes(obj.endPos)) {
			let auto = confirm("Pass through values cannot contain the starting or ending position\n\nDo you want to auto correct it?");
			if (auto) {
				let i1 = b_w.list.indexOf(obj.startPos);
				let i2 = b_w.list.indexOf(obj.endPos);
				if (i1 != -1) {
					b_w.list.splice(i1, 1);
				} else {
					b_w.list.splice(i2, 1);
				}
				text1.value = b_w.list;
			} else {
				return false;
			}
		}
		data.betweens = b_w.list;
	}
	if (obj.restricted) {
		restri = checkAtListStr(obj.restricted)
		if (!restri.status) {
			alert(`Error at: value '${restri.value}' at index '${restri.index}' of don't pass values \nReason: ${restri.error}`)
			return false;
		}
		if (hasDuplicates(restri.list)) {
			let removeIt = confirm("Don't pass values has duplicate values inside it.\n\nDo you want to delete duplicate values?");
			if (removeIt) {
				restri.list = Array.from(new Set(restri.list));
				text2.value = restri.list;
			} else {
				return false;
			}
		};
		if (restri.list.includes(obj.startPos) || restri.list.includes(obj.endPos)) {
			let auto = confirm("Don't pass values cannot contain the starting or ending position\n\nDo you want to auto correct it?");
			if (auto) {
				let i1 = restri.list.indexOf(obj.startPos);
				let i2 = restri.list.indexOf(obj.endPos);
				if (i1 != -1) {
					restri.list.splice(i1, 1);
				} else {
					restri.list.splice(i2, 1);
				}
				text2.value = restri.list;
			} else {
				return false;
			}
		}
		data.restricted = restri.list;
	}
	let intr = intersection(b_w.list || [], restri.list || []);
	if (intr.length > 0) {
		alert(`Values used in 'pass through' cannot be used in restricted at the same time \nUsed: (${intr})`);
		return false;
	}

	if (!obj.noOfMove) {
		alert("No of moves cannot be empty");
		return false;
	}
	let d = getSqDistBw(getPosFromID(obj.startPos), getPosFromID(obj.endPos));
	if (obj.noOfMove == 1 && d >= 1) {
		alert("Number of moves is too low. Try increasing it.")
		return false;
	}
	return data;
}
//The main function to start the code;
function startPrediction(t) {
	//Checks;
	let obj = {
		startPos: parseInt(startPosNum.value),
		endPos: parseInt(endPosNum.value),
		betweens: betweensText.value,
		isInOrder: byOrderCheck.checked,
		restricted: restrictedText.value,
		noOfMove: parseInt(noOfMoveNum.value),
	}
	//Check for errors; if not then start the algorithm;
	let checkup = checkForEverything(obj, betweensText, restrictedText);
	if (checkup) {
		obj.betweens = checkup.betweens;
		obj.restricted = checkup.restricted;

		//Display the user given data to the details box;
		startDisplay.innerHTML = obj.startPos;
		endDisplay.innerHTML = obj.endPos;
		moveDisplay.innerHTML = obj.noOfMove;

		canvas.style.borderBottomLeftRadius = "0px";
		detailsCont.style.transform = "scaleY(1)";

		setVars(obj);
		setup();
		if (t.innerHTML != "Restart") {
			t.innerHTML = "Restart";
			stopBtn.style.opacity = 1;
			stopBtn.removeAttribute("disabled");
		}
		if (stopBtn.innerHTML == "Paused") {
			stopPrediction(stopBtn)
		}
	}
}

//To pause or resume the algorithm;
function stopPrediction(t) {
	if (t.innerHTML == "Pause") {
		paused = true;
		t.style.background = "#4CAF50";
		t.innerHTML = "Paused";
	} else {
		paused = false;
		t.style.background = "#F44336";
		t.innerHTML = "Pause";
	}
}
