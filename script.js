const homePage = document.querySelector(".homePage");
const gamePage = document.querySelector(".gamePage");
const submitButton = document.querySelector("#submitButton");
const boardGrid = document.querySelector("#grid");
const easyButton = document.querySelector("#easy");
const mediumButton = document.querySelector("#medium");
const hardButton = document.querySelector("#hard");
const playerName = document.querySelector("#playerName");
const inputName = document.querySelector("#fname");
const solvedTxt = document.querySelector("#solved");
const restart_btn = document.querySelector("#restart_btn");

//game state vars
//const vars
const empty = "empty";
const black = "black";
const blackNum = "blackNum";
let startTime, endTime;
let timeElapsed;
//true = "1"
//false = "2"

const gridEasy = [
	["", "", "", "1", "", "", ""],
	["", "0", "", "", "", "2", ""],
	["", "", "", "", "", "", ""],
	["#", "", "", "#", "", "", "#"],
	["", "", "", "", "", "", ""],
	["", "#", "", "", "", "2", ""],
	["", "", "", "3", "", "", ""],
];

const gridAdvanced = [
	["", "", "0", "", "#", "", ""],
	["", "", "", "", "", "", ""],
	["#", "", "#", "", "3", "", "#"],
	["", "", "", "1", "", "", ""],
	["2", "", "#", "", "#", "", "#"],
	["", "", "", "", "", "", ""],
	["", "", "#", "", "2", "", ""],
];

const gridExtreme = [
	["", "#", "", "", "", "", "", "", "", ""],
	["", "", "", "", "", "3", "", "2", "", "#"],
	["", "0", "#", "", "", "", "", "#", "", ""],
	["", "", "", "", "#", "", "", "", "", ""],
	["", "1", "", "", "#", "1", "#", "", "", ""],
	["", "", "", "#", "#", "#", "", "", "3", ""],
	["", "", "", "", "", "#", "", "", "", ""],
	["", "", "1", "", "", "", "", "0", "#", ""],
	["3", "", "#", "", "0", "", "", "", "", ""],
	["", "", "", "", "", "", "", "", "0", ""],
];

let currentGrid;
let namePlayer = inputName.value;

//grid object of consisting Tile objects for each tile
let gridObj = [];

//class Tile definition
class Tile {
	constructor(
		indexI,
		indexJ,
		type,
		counter,
		number,
		bulbPut,
		lightTile,
		redTile,
		readyTile,
		color,
		image
	) {
		this.indexI = indexI;
		this.indexJ = indexJ;
		this.type = type;
		this.counter = counter;
		this.number = number;
		this.bulbPut = bulbPut;
		this.lightTile = lightTile;
		this.redTile = redTile;
		this.readyTile = readyTile;
		this.color = color;
		this.image = image;

		//set a div element
		this.divElement = document.createElement("div");
		this.divElement.className = "tile";
		this.divElement.innerHTML = this.number;
		this.divElement.dataset.indexI = this.indexI;
		this.divElement.dataset.indexJ = this.indexJ;
		this.divElement.dataset.type = this.type;
		this.updateDivElement();
	}

	getDivElement() {
		return this.divElement;
	}
	updateDivElement() {
		this.divElement.dataset.counter = this.counter;
		this.divElement.dataset.bulbPut = this.bulbPut;
		this.divElement.dataset.lightTile = this.lightTile;
		this.divElement.dataset.redTile = this.redTile;
		this.divElement.dataset.readyTile = this.readyTile;
		this.divElement.style.backgroundColor = this.color;

		// console.log("type:", this.type);
		// console.log("divType: ", this.divElement.dataset.type);

		// console.log("bulbPut for the obj?:", this.bulbPut);
		// console.log("bulbPut for the div?:", this.divElement.dataset.bulbPut);
	}

	removeDivElement() {
		this.divElement.remove();
	}
}

//this function objectifies the map (string array)
function objectify() {
	for (let i = 0; i < currentGrid.length; i++) {
		let type,
			counter,
			number,
			bulbPut,
			lightTile,
			redTile,
			readyTile,
			color;

		let row = [];

		for (let j = 0; j < currentGrid[i].length; j++) {
			let tile = currentGrid[i][j];
			bulbPut = lightTile = redTile = false;

			if (tile === "") {
				type = empty;
				counter = number = readyTile = null;
				color = "white";
				lightTile = false;
			} else if (tile === "#") {
				type = black;
				counter = number = readyTile = null;
				color = "black";
			} else if (!isNaN(tile)) {
				type = blackNum;
				number = parseInt(tile);
				counter = 0;
				if (parseInt(tile) === 0) readyTile = true;
				else readyTile = false;
				color = "black";
			}

			let tileObj = new Tile(
				i,
				j,
				type,
				counter,
				number,
				bulbPut,
				lightTile,
				redTile,
				readyTile,
				color
			);

			row.push(tileObj);
		}
		gridObj.push(row);
	}
}

//this function draws the grid by adding the Tile object's
//elements to seperate rows and at the end to the main grid div
function drawGrid() {
	for (let i = 0; i < gridObj.length; i++) {
		let row = document.createElement("div");
		row.className = "row";
		for (let j = 0; j < gridObj[i].length; j++) {
			let tile = gridObj[i][j].getDivElement();
			row.appendChild(tile);
		}
		boardGrid.appendChild(row);
	}
}

//this function colors right, left and down, up of the
//tail where a bulb was put
function color(indexI, indexJ) {
	let itself = gridObj[indexI][indexJ];
	itself.bulbPut = true;

	//right coloring
	//i == will be fixed
	//j == will be increasing

	for (let j = indexJ; j < gridObj[0].length; j++) {
		let tileObj = gridObj[indexI][j];
		if (tileObj.type !== "empty") {
			break;
		}

		if (tileObj.bulbPut === true && j !== indexJ) {
			itself.color = "red";
			itself.redTile = true;
			tileObj.color = "red";
			tileObj.redTile = true;
			tileObj.lightTile = false;
		} else if (tileObj.redTile === false) {
			tileObj.color = "yellow";
			tileObj.lightTile = true;
		}
		// console.log("color func -> bulb", tileObj.bulbPut);
		//tileObj.updateDivElement();
	}

	//left coloring
	//i == will be fixed
	//j == will be decreasing

	for (let j = indexJ; j >= 0; j--) {
		let tileObj = gridObj[indexI][j];
		if (tileObj.type !== "empty") {
			break;
		}
		if (tileObj.bulbPut === true && j !== indexJ) {
			itself.color = "red";
			itself.redTile = true;
			tileObj.color = "red";
			tileObj.redTile = true;
			tileObj.lightTile = false;
		} else if (tileObj.redTile === false) {
			tileObj.color = "yellow";
			tileObj.lightTile = true;
		}
		//tileObj.updateDivElement();
	}

	//up coloring
	//i == will be decreasing
	//j == will be fixed

	for (let i = indexI; i >= 0; i--) {
		let tileObj = gridObj[i][indexJ];
		if (tileObj.type !== "empty") {
			break;
		}
		if (tileObj.bulbPut === true && i !== indexI) {
			itself.color = "red";
			itself.redTile = true;
			tileObj.color = "red";
			tileObj.redTile = true;
			tileObj.lightTile = false;
		} else if (tileObj.redTile === false) {
			tileObj.color = "yellow";
			tileObj.lightTile = true;
		}
		//tileObj.updateDivElement();
	}

	//down coloring
	//i == will be increasing
	//j = will be fixed

	for (let i = indexI; i < gridObj[0].length; i++) {
		let tileObj = gridObj[i][indexJ];
		if (tileObj.type !== "empty") {
			break;
		}
		if (tileObj.bulbPut === true && i !== indexI) {
			itself.color = "red";
			itself.redTile = true;
			tileObj.color = "red";
			tileObj.redTile = true;
			tileObj.lightTile = false;
		} else if (tileObj.redTile === false) {
			tileObj.color = "yellow";
			tileObj.lightTile = true;
		}
		//tileObj.updateDivElement();
	}
	update();
}

//this function decolors right, left and down, up of the
//tail where a bulb was taken
function decolor(indexI, indexJ) {
	gridObj[indexI][indexJ].bulbPut = false;

	//right coloring
	//i == will be fixed
	//j == will be increasing
	for (let j = indexJ; j < gridObj[0].length; j++) {
		let tileObj = gridObj[indexI][j];
		if (tileObj.type !== "empty") {
			break;
		}

		if (tileObj.redTile === true) {
			tileObj.color = "yellow";
			tileObj.redTile = false;
		} else {
			tileObj.color = "white";
			tileObj.lightTile = false;
		}
		//tileObj.updateDivElement();
	}

	//left coloring
	//i == will be fixed
	//j == will be decreasing

	for (let j = indexJ; j >= 0; j--) {
		let tileObj = gridObj[indexI][j];
		if (tileObj.type !== "empty") {
			break;
		}
		if (tileObj.redTile === true) {
			tileObj.color = "yellow";
			tileObj.redTile = false;
		} else {
			tileObj.color = "white";
			tileObj.lightTile = false;
		}
		//tileObj.updateDivElement();
	}

	//up coloring
	//i == will be decreasing
	//j == will be fixed

	for (let i = indexI; i >= 0; i--) {
		let tileObj = gridObj[i][indexJ];
		if (tileObj.type !== "empty") {
			break;
		}
		if (tileObj.redTile === true) {
			tileObj.color = "yellow";
			tileObj.redTile = false;
		} else {
			tileObj.color = "white";
			tileObj.lightTile = false;
		}
		//tileObj.updateDivElement();
	}

	//down coloring
	//i == will be increasing
	//j = will be fixed

	for (let i = indexI; i < gridObj[0].length; i++) {
		let tileObj = gridObj[i][indexJ];
		if (tileObj.type !== "empty") {
			break;
		}
		if (tileObj.redTile === true) {
			tileObj.color = "yellow";
			tileObj.redTile = false;
		} else {
			tileObj.color = "white";
			tileObj.lightTile = false;
		}
		//tileObj.updateDivElement();
	}
	update();
}

function update() {
	for (let i = 0; i < gridObj.length; i++) {
		for (let j = 0; j < gridObj[i].length; j++) {
			gridObj[i][j].updateDivElement();
		}
	}
}

function removeElements() {
	for (let i = 0; i < gridObj.length; i++) {
		for (let j = 0; j < gridObj[i].length; j++) {
			gridObj[i][j].removeDivElement();
		}
	}
}

//this function rerenders the main grid
//thus the coloring can be done again propertly
//after solving a conflict of bulbs (red situation)
function reRenderGrid() {
	for (let i = 0; i < gridObj.length; i++) {
		let row = gridObj[i];
		for (let j = 0; j < row.length; j++) {
			let tileObj = row[j];
			if (tileObj.bulbPut === true) {
				color(i, j);
			}
		}
	}
}

function winGameCheck() {
	for (let i = 0; i < gridObj.length; i++) {
		let row = gridObj[i];
		for (let j = 0; j < row.length; j++) {
			let tileObj = row[j];
			if (tileObj.type === "empty") {
				if (tileObj.lightTile === false || tileObj.red === true) {
					return false;
				}
			}
			if (tileObj.type === "blackNum") {
				if (tileObj.readyTile === false) {
					return false;
				}
			}
		}
	}

	return true;
}

function countBlackNum(indexI, indexJ) {
	//check one back front up down of the clicked object
	//if there is a blacknum type of box in the adjacent clicked box
	//check their innerHtml number, count until its zero
	//if u put more adjacents bulbs to the box
	//make the box go red
	let oneBack = null,
		oneFront = null,
		oneUp = null,
		oneDown = null;

	if (indexJ - 1 >= 0) {
		oneBack = gridObj[indexI][indexJ - 1];
	}

	if (indexJ + 1 < gridObj.length) {
		oneFront = gridObj[indexI][indexJ + 1];
	}

	if (indexI - 1 >= 0) {
		oneUp = gridObj[indexI - 1][indexJ];
	}

	if (indexI + 1 < gridObj.length) {
		oneDown = gridObj[indexI + 1][indexJ];
	}

	const checks = [oneBack, oneFront, oneDown, oneUp];
	console.log(checks);

	let incrementCounters = [];

	//4 is the number of blocks need to be checked
	for (let i = 0; i < 4; i++) {
		let check = checks[i];
		if (check === null) {
			continue;
		}

		if (check.type === "blackNum") {
			if (check.counter >= check.number) {
				return false;
			}
			incrementCounters.push(check);
		}
	}

	incrementCounters.forEach((block) => {
		block.counter = block.counter + 1;
		if (block.counter === block.number) {
			block.readyTile = true;
			block.color = "green";
		}
	});

	update();
	return true;
}

function reversedCountBlackNum(indexI, indexJ) {
	//check one back front up down of the clicked object
	//if there is a blacknum type of box in the adjacent clicked box
	//check their innerHtml number, count until its zero
	//if u put more adjacents bulbs to the box
	//make the box go red
	let oneBack = null,
		oneFront = null,
		oneUp = null,
		oneDown = null;

	if (indexJ - 1 >= 0) {
		oneBack = gridObj[indexI][indexJ - 1];
	}

	if (indexJ + 1 < gridObj.length) {
		oneFront = gridObj[indexI][indexJ + 1];
	}

	if (indexI - 1 >= 0) {
		console.log("assigned to be null still");
		oneUp = gridObj[indexI - 1][indexJ];
	}

	if (indexI + 1 < gridObj.length) {
		oneDown = gridObj[indexI + 1][indexJ];
	}

	const checks = [oneBack, oneFront, oneDown, oneUp];
	//4 is the number of blocks need to be checked
	for (let i = 0; i < 4; i++) {
		let check = checks[i];
		if (check === null) {
			continue;
		}

		if (check.type === "blackNum") {
			check.counter = check.counter - 1;
			check.readyTile = false;
			check.color = "black";
		}

		update();

		// console.log("back:",oneBack.getDivElement().innerHTML)
		// console.log("front:",oneFront.getDivElement().innerHTML)
		// console.log("up:",oneUp.getDivElement().innerHTML)
		// console.log("down:",oneDown.getDivElement().innerHTML)
	}
}

//main function - runTime
function gameRunTime() {
	objectify();
	drawGrid();
	clickOnTile();
	playerName.innerHTML = "Hi " + namePlayer + " :)";
}

//eventListeners
function clickOnTile() {
	const tiles = document.querySelectorAll(".tile");
	tiles.forEach((tile) => {
		tile.addEventListener("click", () => {
			let i = parseInt(tile.dataset.indexI);
			let j = parseInt(tile.dataset.indexJ);

			if (
				tile.dataset.type === "empty" &&
				tile.dataset.bulbPut === "false"
			) {
				//console.log("bulbPut in click func:", tile.dataset.bulbPut);
				if (countBlackNum(i, j)) {
					tile.dataset.color = "yellow";
					let img = document.createElement("img");
					img.src = "lightbulb.png";
					img.className = "img";
					tile.appendChild(img);

					color(i, j);
				} else {
					console.log("cannot put a lamp");
				}
			} else if (tile.dataset.bulbPut === "true") {
				tile.innerHTML = "";
				decolor(i, j);
				reversedCountBlackNum(i, j);
				reRenderGrid();
			}
			winGameCheck();
			console.log("win?: ", winGameCheck());
			if (winGameCheck()) {
				solvedTxt.innerHTML = "You have solved the game!";
				restart_btn.style.display = "block";
			} else {
				solvedTxt.innerHTML = "";
			}
		});
	});
}

submitButton.addEventListener("click", (event) => {
	event.preventDefault();

	namePlayer = inputName.value;
	if (namePlayer != "") {
		console.log(namePlayer);
		if (easyButton.checked === true) {
			currentGrid = gridEasy;
			homePage.style.display = "none";
			gamePage.style.display = "flex";
			gameRunTime();
		} else if (mediumButton.checked === true) {
			currentGrid = gridAdvanced;
			homePage.style.display = "none";
			gamePage.style.display = "flex";
			gameRunTime();
		} else if (hardButton.checked === true) {
			currentGrid = gridExtreme;
			homePage.style.display = "none";
			gamePage.style.display = "flex";
			gameRunTime();
		}
	}
});

restart_btn.addEventListener("click", () => {
	homePage.style.display = "flex";
	gamePage.style.display = "none";

	console.log("gridObj: ", gridObj);
	console.log("gridElements: ", boardGrid);
	update();
	console.log("gridObj: after freeing ", gridObj);
	console.log("gridElements: free ", boardGrid);
	removeElements();
	gridObj = [];
	console.log("gridObj: after freeing ", gridObj);
	console.log("gridElements: free ", boardGrid);
	solvedTxt.innerHTML = "";
	restart_btn.style.display = "none";
	// document.location.reload();
});
