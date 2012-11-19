/* Tile definition */
var Tile = function(thickness, color, step) {
    this.x = 0;
    this.y = 0;
    this.width = thickness;
    this.height = thickness;
    this.color = color
    this.step = (step == undefined) ? thickness : step;
}

Tile.prototype.setPos = function(x, y) {
    this.x = x;
    this.y = y;
}

Tile.prototype.update = function(direction) {
    switch (direction) {
    case DIRECTION.UP:
        this.y -= this.step;
        break;
    case DIRECTION.DOWN:
        this.y += this.step;
        break;
    case DIRECTION.LEFT:
        this.x -= this.step;
        break;
    case DIRECTION.RIGHT:
        this.x += this.step;
        break;
    default:
        break;
    }

    this.y = ((this.y % canvas.height) + canvas.height) % canvas.height;
    this.x = ((this.x % canvas.width) + canvas.width) % canvas.width;
}

Tile.prototype.draw = function(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
}

/* Constants */
var TICK_INTERVAL = 100;

var DIRECTION = {
    UP:    1,
    DOWN:  2,
    LEFT:  3,
    RIGHT: 4
}

var KEY = {
    UP:    38,
    DOWN:  40,
    LEFT:  37,
    RIGHT: 39   
}

/* Game variables */
var canvas; 
var context;
var playing;
var tiles;
var currentDirection;

/* Game functions */
function init() {
    canvas = document.getElementById("game_canvas");
    context = canvas.getContext("2d");
    playing = false;
    tiles = [new Tile(10, "#000000")];
    currentDirection = DIRECTION.DOWN;

    canvas.addEventListener("keydown", handleKeyboardInput, true);
    canvas.focus();
}

function tick() {
    if (!playing)
        return;

    update();
    draw();

    setTimeout(tick, TICK_INTERVAL);
}

function handleKeyboardInput(event) {
    if (!playing)
        return;

    switch(event.keyCode) {
    case KEY.UP:
        currentDirection = DIRECTION.UP;
        break;
    case KEY.DOWN:
        currentDirection = DIRECTION.DOWN;
        break;
    case KEY.LEFT:
        currentDirection = DIRECTION.LEFT;
        break;
    case KEY.RIGHT:
        currentDirection = DIRECTION.RIGHT;
        break;
    default:
        break;
    }
}

function update() {
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].update(currentDirection);
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < tiles.length; i++) {
        tiles[i].draw(context);
    }
}

/* main function */
function main() {
    init();

    playing = true;
    setTimeout(tick, TICK_INTERVAL);
}

console.log("LET THE TILES BEGIN!");
main();