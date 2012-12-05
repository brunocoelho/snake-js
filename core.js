/* Tile definition */
var Tile = function(thickness, color, step) {
    this.x = 0;
    this.y = 0;
    this.width = thickness;
    this.height = thickness;
    this.color = color;
    this.step = (step == undefined) ? thickness : step;
}

Tile.prototype.setPos = function(point) {
    this.x = point.x;
    this.y = point.y;
}

Tile.prototype.collides = function(that) {
    return this.x == that.x && this.y == that.y;
}

Tile.prototype.update = function(direction) {
    switch (direction) {
    case Direction.UP:
        this.y -= this.step;
        break;
    case Direction.DOWN:
        this.y += this.step;
        break;
    case Direction.LEFT:
        this.x -= this.step;
        break;
    case Direction.RIGHT:
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

/* Snake definition */
var Snake = function() {
    this.tiles = [new Tile(TILE_THICKNESS, "black")];
    this.head = this.tiles[0];
    this.direction = Direction.DOWN;
    this.addNewTile = false;
}

Snake.prototype.grow = function() {
    this.addNewTile = true;
}

Snake.prototype.hasCollision = function() {
    for (var i = 1; i < this.tiles.length; i++) {
        if (this.head.collides(this.tiles[i]))
            return true;
    }
    return false;
}

Snake.prototype.update = function() {
    var newHead;
    if (this.addNewTile) {
        this.addNewTile = false;
        newHead = new Tile(TILE_THICKNESS, "black");
    } else {
        newHead = this.tiles.pop();
    }

    newHead.setPos(this.head);
    this.tiles.splice(0, 0, newHead);
    this.head = this.tiles[0];
    this.head.update(this.direction);
}

Snake.prototype.draw = function(context) {
    for (var i = 0; i < this.tiles.length; i++)
        this.tiles[i].draw(context);
}

/* requestAnimationFrame function */
var requestAnimationFrame = (function() {
    return window.requestAnimationFrame
           || window.webkitRequestAnimationFrame
           || window.mozRequestAnimationFrame
           || window.oRequestAnimationFrame
           || window.msRequestAnimationFrame
           || function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

/* Constants */
var TICK_INTERVAL = 100;
var MAX_FRUIT_INTERVAL = 10000;
var TILE_THICKNESS = 20;

/* Enums */
var Direction = {
    UP:    1,
    DOWN:  2,
    LEFT:  3,
    RIGHT: 4
}

var Key = {
    UP:    38,
    DOWN:  40,
    LEFT:  37,
    RIGHT: 39
}

/* Game variables */
var canvas;
var context;
var playing;
var lastUpdateTime;
var lastFruitTime;
var createFruitInterval;
var snake;
var fruits;

/* Game functions */
function init() {
    canvas = document.getElementById("game_canvas");
    context = canvas.getContext("2d");
    playing = false;
    lastUpdateTime = lastFruitTime = new Date();
    createFruitInterval = Math.random() * MAX_FRUIT_INTERVAL;
    snake = new Snake();
    fruits = [];

    canvas.addEventListener("keydown", handleKeyboardInput, true);
    canvas.focus();
}

function reset() {
    snake = new Snake();
    fruits = [];
}

function tick(currentTime) {
    if (!playing) {
        requestAnimationFrame(tick);
        return;
    }

    var delta = currentTime - lastUpdateTime;
    if (delta > TICK_INTERVAL) {
        update();
        draw();
        lastUpdateTime = currentTime;
    }

    var delta2 = currentTime - lastFruitTime;
    if (delta2 > createFruitInterval && fruits.length === 0) {
        createFruit();
        createFruitInterval = Math.random() * MAX_FRUIT_INTERVAL;
        lastFruitTime = currentTime;
    }

    requestAnimationFrame(tick);
}

function handleKeyboardInput(event) {
    if (!playing)
        return;

    if (snake.direction == Direction.UP || snake.direction == Direction.DOWN) {
        if (event.keyCode == Key.LEFT)
            snake.direction = Direction.LEFT;
        else if (event.keyCode == Key.RIGHT)
            snake.direction = Direction.RIGHT;
    } else {
        if (event.keyCode == Key.UP)
            snake.direction = Direction.UP;
        else if (event.keyCode == Key.DOWN)
            snake.direction = Direction.DOWN
    }
}

function update() {
    snake.update();

    // Check game over
    if (snake.hasCollision())
        reset();

    // Check if the snake ate some fruit
    for (var i = 0; i < fruits.length; i++) {
        if (fruits[i].collides(snake.head)) {
            fruits.splice(i, 1);
            snake.grow();
        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    snake.draw(context);
    for (var i = 0; i < fruits.length; i++)
        fruits[i].draw(context);
}

function createFruit() {
    var fruit = new Tile(TILE_THICKNESS, "red");
    fruit.x = Math.floor(Math.random() * canvas.width / TILE_THICKNESS) * TILE_THICKNESS;
    fruit.y = Math.floor(Math.random() * canvas.height / TILE_THICKNESS) * TILE_THICKNESS;
    fruits.push(fruit);
}

/* main function */
function main() {
    init();

    playing = true;
    requestAnimationFrame(tick);
}

main();

document.getElementById("pause_button").addEventListener("click", function() {
    playing = !playing;

    if (playing) {
        this.src = "images/pause.png";
        canvas.focus();
    } else {
        this.src = "images/play.png";
    }
});
