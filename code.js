//set up the canvas
var canvas = document.createElement("canvas");
canvas.id = "game";
var ctx = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 320;
document.body.appendChild(canvas);

//get the map sprites
var map;
var rows = 20;
var cols = 20;
var size = 16;
var terrain = new Image();
terrain.src = "sprites/mapGrid4.png";
var terrainReady = false;
terrain.onload = function(){
  terrainReady = true;
};

//nature objects
var treeBottom = new Image();
treeBottom.src = "sprites/tree_trunk2.png";
treeBottomReady = false;
treeBottom.onload = function(){
  treeBottomReady = true;
};
var treeTop = new Image();
treeTop.src = "sprites/tree_leaves2.png";
treeTopReady = false;
treeTop.onload = function(){
  treeTopReady = true;
};

//background image
var bgPNG = new Image();
bgPNG.src = "sprites/bg.png";
bgPNG.onload = function(){
  ctx.drawImage(bgPNG, 0, 0);
};

//bot variables

//bot image properties
var botIMG = new Image();
botIMG.src = "sprites/shu-full.png";
var botReady = false;
botIMG.onload = function(){botReady = true;};

//bot object
var bot = {
  //sprite properties
  name : "shu",
  width : 32,
  height : 20,
  dir : "south",
  action: "idle",
  img : botIMG,
  ready : botReady,

  //advance properties
  health : 100,
  target : null,
  priority : "none",
  pathQueue : [],
  brain : [],
  thinkIndex : 0,
  money : 0,

  //movement
  speed : 2,
  maxSpeed : 2,
  x : 9 * size, 
  y : 9 * size,
  velX : 0,
  velY : 0,
  fps : 4,            //frame speed
  fpr : 12,            //# of frames per row
  show : true,
  
  //animation
  idleNorth : [4,4,4,4],
  idleSouth : [1,1,1,1],
  idleWest : [7,7,7,7],
  idleEast : [10,10,10,10],
  moveNorth : [3,4,5,4],
  moveSouth : [0,1,2,1],
  moveWest : [6,7,8,7],
  moveEast : [9,10,11,10],
  curFrame : 0,
  ct : 0
};

//arrow sprite
var arrowIMG = new Image();
var arrowReady = false;
var arrowShow = false;
arrowIMG.src = "sprites/arrow.png";
arrowIMG.onload = new function(){arrowReady = true;}

//simulation variables
var log = "----SIMULATION START----\n";


//////////////////////       ITEM FUNCTIONS       //////////////

var itemSet = [];
var foodSet = [];
var moneySet = [];
var weaponSet = [];
var enemySet = [];

//generic function for all items
function item(name, x, y){
  this.name = name;
  this.x = x;
  this.y = y;
  this.show = true;
  this.img;
  this.imgReady;
  this.dispX = 0;
  this.dispY = 0;
  this.spec;
  this.value;
  this.offset;
}

///// import all the image sprites ////// 
//apple
var appleIMG = new Image();
var appleReady = false;
appleIMG.src = "sprites/apple.png";
appleIMG.onload = new function(){appleReady = true;}

//money bags
var moneyIMG = new Image();
var moneyReady = false;
moneyIMG.src = "sprites/moneys.png";
moneyIMG.onload = new function(){moneyReady = true;}

//gems
var gemIMG = new Image();
var gemReady = false;
gemIMG.src = "sprites/gems.png";
gemIMG.onload = new function(){gemIMG = true;}

////////   item functions   ////////
//resets all the groups
function resetSets(){
  itemSet = [];
  foodSet = [];
  moneySet = [];
  weaponSet = [];
  enemySet = [];
}

//initiate food items
function itemProb(name, max){
  this.name = name;
  this.max = max;
}

//initiate the food items
function makeFoods(probs){
  for(var f = 0; f < probs.length; f++){
    var genNum = Math.floor(Math.random() * (probs[f].max + 1));
    for(var n = 0; n < genNum; n++){
      var x = Math.floor(Math.random() * cols);
      var y = Math.floor(Math.random() * rows);
      var it;
      if(probs[f].name == "apple"){
        it = new item("apple", x, y);
        it.img = appleIMG;
        it.imgReady = appleReady;
        it.dispX = 4;
        it.dispY = 6;
        it.spec = "health";
        it.value = 5;
      }
      itemSet.push(it);
      foodSet.push(it);
    }
  }
}

//make the money objects
function makeMoney(probs){
  for(var f = 0; f < probs.length; f++){
    var genNum = Math.floor(Math.random() * (probs[f].max + 1));
    for(var n = 0; n < genNum; n++){
      var x = Math.floor(Math.random() * cols);
      var y = Math.floor(Math.random() * rows);
      var it;
      if(probs[f].name == "bag"){
        it = new item("bag", x, y);
        it.img = moneyIMG;
        it.imgReady = moneyReady;
        it.dispX = 1;
        it.dispY = 1;
        it.spec = "money";
        it.value = 50;
      }else if(probs[f].name == "gem"){
        it = new item("gem", x, y);
        it.img = randomGem();
        it.imgReady = gemReady;
        it.dispX = 4;
        it.dispY = 4;
        it.spec = "money";
        it.value = 50;
      }
      itemSet.push(it);
      moneySet.push(it);
    }
  }
}

//organize items by category
function organizeItems(){
  for(var a = 0; a < itemSet.length; a++){
    var myItem = itemSet[a];
    if(myItem.name == "apple")
      foodSet.push(myItem);
  }
}

//have a bot pick up said item
function pickup(robot){
  for(var a = 0; a < itemSet.length; a++){
    var myItem = itemSet[a];
    if(isTouching(robot, myItem) && myItem.show){
      console.log(myItem.name + " get!");
      newLog(myItem.name + " get!");
      myItem.show = false;
    }
  }
}

//check if collision on same tile with item and robot
function isTouching(robot, item){
  var botX = Math.round(robot.x / size);
  var botY = Math.round(robot.y / size);

  if(botX == item.x && botY == item.y)
    return true;
  else
    return false;
}

//check if a certain item is in a certain group
function inGroup(item, group){
  for(var r = 0; r < group.length; r++){
    if(group[r] == item)
      return true;
  }
  return false;
}


//////////////////////        MAP FUNCTIONS       //////////////


//start with a blank map or something
function blankMap(){
	map = [];
	for(var a = 0; a < rows; a++){
		var row = [];
		for(var b = 0; b < cols; b++){
			row[b] = 0;
		}
		map[a] = row;
	}
}

//make completely random tiled map
function randomMap(){
	map = [];
	for(var a = 0; a < rows; a++){
		var row = [];
		for(var b = 0; b < cols; b++){
			row[b] = randomTerrain();
		}
		map[a] = row;
	}
}
//return random terrain value based on probability
function randomTerrain(){
	//grass - 70%, wter - 10%, earth - 20%
	var chance = Math.floor(Math.random() * 100);
	if(chance > 30)
		return 0;
	else if(chance > 20)
		return 1;
	else
		return 2;
}
//randomMap();


//randomizes the nature pools all over the map
function addNature(multi, obj, prob, dec){
  var range = Math.floor(Math.random() * multi) + 1
  for(var a = 0; a < rows; a+=(range)){
    for(var b = 0; b < cols; b+=(range)){
      generate(obj, prob, dec, b, a);
    }
  }
}

//generates nature pools
function generate(obj, prob, dec, x, y){
  var r = Math.random();
  if(r < prob){
    make(obj, x, y);

    //go in each direction
    generate(obj, prob - dec, dec, x, y+1);
    generate(obj, prob - dec, dec, x, y-1);
    generate(obj, prob - dec, dec, x+1, y);
    generate(obj, prob - dec, dec, x-1, y);
  }else{
    return;
  }
}

//create a terrain tile at the specific pt on the map
function make(obj, x, y){
  if((x >= 0 && x < rows) && (y >= 0 && y < cols) && map[y][x] == 0)
    map[y][x] = obj;
}


////// bot check //////

//if at the edge of the map
function atWorldsEnd(bot){
  var halfTile = size / 2;
  if(bot.x <= -halfTile){                            //edge of west side
    braveNewWorld("west", bot);
  }else if(bot.x >= ((cols * size) - halfTile)){     //edge of east side
    braveNewWorld("east", bot);
  }else if(bot.y <= -halfTile){                      //edge of west side
    braveNewWorld("north", bot);
  }else if(bot.y >= ((rows * size) - halfTile)){     //edge of east side
    braveNewWorld("south", bot);
  }
}

//generates a new world map with bot starting from an edge
function braveNewWorld(direction, robot){
  //moving = false;
  var halfTile = size / 2;
  if(direction == "north"){             //spawn at the bottom
    robot.y = rows * size - halfTile;
    initPos = rows * size;
  }else if(direction == "south"){       //spawn at the top
    robot.y = -halfTile;
    initPos = -size;
  }else if(direction == "west"){        //spawn at the right
    robot.x = cols * size - halfTile;
    initPos = cols * size;
  }else if(direction == "east"){        //spawn at the left
    robot.x = -halfTile;
    initPos = -size;
  }

  
  blankMap();
  resetSets();
  addNature(3, 1, 0.2, 0.01);               //water
  addNature(4, 3, 0.25, 0.02);              //tree
  makeFoods([new itemProb("apple", 5)]);    //foods
  resetBot(bot);
  newLog("next world!");
}
//generates a new world map with bot starting from a point
function braveNewWorld2(robot, x, y, spec){
  robot.x = size * x;
  robot.y = size * y;
  moving = false;
  blankMap(); 
  resetSets();
  addNature(3, 1, 0.2, 0.01);                //water
  addNature(4, 3, 0.25, 0.02);               //tree
  makeFoods([new itemProb("apple", 5)]);     //foods 

}

//start screen
braveNewWorld2(bot, 9, 9, "none");


///////////////            BOT FUNCTIONS             ///////////

function resetBot(robot){
  robot.thinkIndex = 0;
  robot.pathQueue = [];
}

var initPos;
var moving;
function goNorth(robot){
  if(!moving){
    initPos = Math.floor(robot.y / size) * size;
    robot.dir = "north";
    robot.action = "travel";
  }
}
function goSouth(robot){
  if(!moving){
    initPos = Math.floor(robot.y / size) * size;
    robot.dir = "south";
    robot.action = "travel";
  }
}
function goEast(robot){
  if(!moving){
    initPos = Math.floor(robot.x / size) * size;
    robot.dir = "east";
    robot.action = "travel";
  }
}
function goWest(robot){
  if(!moving){
    initPos = Math.floor(robot.x / size) * size;
    robot.dir = "west";
    robot.action = "travel";
  }
}
function travel(robot){
  if(robot.action == "travel"){   //continue if allowed to move
    //travel north
    if(robot.dir == "north"){
      if(Math.floor(robot.y) > (initPos - size)){
        robot.velY = robot.speed;
        robot.y += velControl(Math.floor(robot.y), -robot.velY, (initPos - size));
        moving = true;
      }else{
        robot.velY = 0;
        robot.action = "idle";
        moving = false;
      }
    }else if(robot.dir == "south"){
      if(Math.floor(robot.y) < (initPos + size)){
        robot.velY = robot.speed;
        robot.y += velControl(Math.floor(robot.y), robot.velY, (initPos + size));;
        moving = true;
      }else{
        robot.velY = 0;
        robot.action = "idle";
        moving = false;
      }
    }else if(robot.dir == "east"){
      if(Math.floor(robot.x) < (initPos + size)){
        robot.velX = robot.speed;
        robot.x += velControl(Math.floor(robot.x), robot.velX, (initPos + size));
        moving = true;
      }else{
        robot.velX = 0;
        robot.action = "idle";
        moving = false;
      }
    }else if(robot.dir == "west"){
      if(Math.floor(robot.x) > (initPos - size)){
        robot.velX = robot.speed;
        robot.x += velControl(Math.floor(robot.x), -robot.velX, (initPos - size));;
        moving = true;
      }else{
        robot.velX = 0;
        robot.action = "idle";
        moving = false;
      }
    }
  }
}

//velocity control
function velControl(cur, value, max){
  //increment or decrement
  if(value > 0){
    if((cur + value) > max)
      return velControl(cur, Math.floor(value/2), max);
    else
      return value;
  }else if(value < 0){
    if((cur + value) < max)
      return velControl(cur, Math.floor(value/2), max);
    else
      return value;
  }else{
    return value;
  }
}

//arrow to locate the robot in the trees
function finderArrow(robot){
  var posX = Math.round(robot.x / 16);
  var posY = Math.round(robot.y / 16) + 1;

  if((posX >= 0 && posX < cols) && (posY >= 0 && posY < rows) && ((posY - 1) >= 0)){
    if(map[posY - 1][posX] == 3 || map[posY][posX] == 3){
      arrowShow = true;
    }else{
      arrowShow = false;
    }
  }
}

//change the speed of the robot based on the terrain 
function terrainTrek(robot){
  var posX = Math.round(robot.x / 16);
  var posY = Math.round(robot.y / 16);

  if(posX >= 0 && posY >= 0 && posX < cols && posY < rows){
    if(map[posY][posX] == 1){           //water
      robot.speed = robot.maxSpeed / 2;
    }else if(map[posY][posX] == 2){     //sand-dirt
      robot.speed = robot.maxSpeed / 2;
    }else{                              //grass
      robot.speed = robot.maxSpeed;
    }
  }
}


////////   AI DECISION MAKING   ////////

//act upon the robot pathQueue
function smallStep(robot){
  if(robot.pathQueue.length != 0 && !moving){       //if not already moving and not an empty pathQueue
    var nextStep = robot.pathQueue[0];
    var curX = Math.floor(robot.x / 16);
    var curY = Math.floor(robot.y / 16);

    //changing y pos
    if(curX == nextStep[0]){
      if(nextStep[1] < curY)
        goNorth(robot);
      else if(nextStep[1] > curY)
        goSouth(robot);
    }   
    //changing x pos    
    else if(curY == nextStep[1]){
      if(nextStep[0] < curX)
        goWest(robot);
      else if(nextStep[0] > curX)
        goEast(robot);
    }
    //remove the node once reached
    robot.pathQueue.shift();
  }
}

//sample circle function
function circleUp(robot, radius){
  //reset the properties
  var initX = Math.floor(robot.x / 16);
  var initY = Math.floor(robot.y / 16);
  var linePath = [];
  var last;
  robot.pathQueue = [];

  //make waypoints
  linePath.push([initX, initY]);        //initial position

  //add r waypoints north
  for(var a = 1; a < radius; a++){
    last = linePath[linePath.length - 1];
    linePath.push([last[0], last[1] - 1]);
  }
  //add r waypoints east
  for(var a = 1; a < radius; a++){
    last = linePath[linePath.length - 1];
    linePath.push([last[0] + 1, last[1]]);
  }
  //add r waypoints south
  for(var a = 1; a < radius; a++){
    last = linePath[linePath.length - 1];
    linePath.push([last[0], last[1] + 1]);
  }
  //add r waypoints west
  for(var a = 1; a < radius; a++){
    last = linePath[linePath.length - 1];
    linePath.push([last[0] - 1, last[1]]);
  }
  
  //add all to robot's path pathQueue [override]
  robot.pathQueue = linePath;
}



//import the actions
function makeACompass(robot, set){
  for(var a = 0; a < botSets.length; a++){
    if(botSets[a].name == set){
      robot.brain = botSets[a].actions;
    }
  }
}

//decides how to walk
var useCompass = true;
function compass(robot){
  //if out of options
  if(robot.thinkIndex >= robot.brain.length){
    processDir(robot, gotoEdge(robot));
  }

  var plan = robot.brain[robot.thinkIndex];
  var objective = think(robot, plan);
  if(objective == "done"){
    robot.thinkIndex++;
  }else{
    processDir(robot, objective);
  }
}

//brain blast!
function think(robot, action){
  if(action == "health"){
    return gotoDumb(robot, gotoClosest(robot, foodSet), map, size);
  }else{
    return "done";
  }
}

function processDir(robot, dir){
  //reset the properties
  var initX = Math.floor(robot.x / 16);
  var initY = Math.floor(robot.y / 16);

  //add the next to the robot queue
  if(dir == "north")
    robot.pathQueue.push([initX, initY - 1]);
  else if(dir == "south")
    robot.pathQueue.push([initX, initY + 1]);
  else if(dir == "east")
    robot.pathQueue.push([initX - 1, initY]);
  else if(dir == "west")
    robot.pathQueue.push([initX + 1, initY]);
}

//random walking
function drunkardsWalk(robot){
  var dice;
  if(!moving){
    dice = Math.floor(Math.random() * 4);
    if(dice == 0){
      goNorth(bot);
    }else if(dice == 1){
      goSouth(bot);
    }else if(dice == 2){
      goWest(bot);
    }else if(dice == 3){
      goEast(bot);
    }
  }
}

//go to closest object
function gotoClosest(robot, group){
  //check if any elements
  if(group.length == 0)
    return null;

  //check if all of the elements are gone
  var goodSet = [];
  for(var f = 0; f < group.length; f++){
    if(group[f].show)
      goodSet.push(group[f]);
  }
  if(goodSet.length == 0)
    return null;

  //otherwise find the closest
  else{
    var dists = [];
    var botX = Math.floor(robot.x / size);
    var botY = Math.floor(robot.y / size);

    //get the total distance for each item
    for(var d = 0; d < goodSet.length; d++){
      var distX = Math.abs(botX - goodSet[d].x);
      var distY = Math.abs(botY - goodSet[d].y);
      var distTot = distX + distY;
      dists.push(distTot);
    }
    var smallest = 0;
    for(var e = 0; e < dists.length; e++){
      if(dists[smallest] > dists[e]){
        smallest = e;
      }
    }
    return goodSet[smallest];
  }
}

//go to the closest side of the edge of the screen
function gotoEdge(robot){
  var coordX = Math.round(robot.x / size) - (map[0].length/2);
  var coordY = Math.round(robot.y / size) - (map.length/2);

  if(Math.abs(coordX) > Math.abs(coordY)){    //more horizontal
    if(coordX > 0)
      return "west";
    else
      return "east";
  }else if(Math.abs(coordY) > Math.abs(coordX)){                                      //more vertical
    if(coordY > 0)
      return "south";
    else
      return "north";
  }else{
    if(coordX == 0 && coordY == 0)            //origin
      return "north";
    else if(coordX > 0 && coordY > 0){        //Q1
      return "east";
    }else if(coordX < 0 && coordY > 0){       //Q2
      return "north";
    }else if(coordX < 0 && coordY < 0){       //Q3
      return "west";
    }else if(coordX > 0 && coordY < 0){       //Q4
      return "south";
    }
  }
}


/////////////////////////DRAWING AND RENDERING//////////////////////////
//rendering function for the map
function drawMap(){
  if(terrainReady){
    for(var y = 0; y < rows; y++){
      for(var x = 0; x < cols; x++){
        ctx.drawImage(terrain, size * map[y][x], 0, size, size, (x * size), (y * size), size, size);
      }
    }
  }
}
function drawTreeTop(){
  if(treeTopReady){
    for(var y = 0; y < rows; y++){
      for(var x = 0; x < cols; x++){
        if(map[y][x] == 3)
        ctx.drawImage(treeTop, 0, 0, 
            treeTop.width, treeTop.height, 
            (x * size) - 16, (y * size) - 20, 
            treeTop.width, treeTop.height);
      }
    }
  }
}
function drawTreeBottom(){
  if(treeBottomReady){
    for(var y = 0; y < rows; y++){
      for(var x = 0; x < cols; x++){
        if(map[y][x] == 3)
        ctx.drawImage(treeBottom, 0, 0, 
            treeBottom.width, treeBottom.height, 
            (x * size) - 4, (y * size) - 8, 
            treeBottom.width, treeBottom.height);
      }
    }
  }
}

//rendering function for the items
function drawItems(){
  for(var a = 0; a < itemSet.length; a++){
    var it = itemSet[a];

    if(it.imgReady && it.show){
      ctx.drawImage(it.img, 0, 0, 
                it.img.width, it.img.height,
                (it.x * size) + it.dispX, 
                (it.y * size) + it.dispY,
                it.img.width, it.img.height);
    }
  }
}

//rendering functions for the characters
function drawBot(){
    updaterobot(bot);
    renderrobot(bot);
}
function updaterobot(robot){
  //set the animation sequence
  var sequence;
  if(robot.dir == "north")
    sequence = robot.moveNorth;
  else if(robot.dir == "south")
    sequence = robot.moveSouth;
  else if(robot.dir == "west")
    sequence = robot.moveWest;
  else if(robot.dir == "east")
    sequence = robot.moveEast;
    
  //update the frames
  if(robot.ct == (robot.fps - 1))
    robot.curFrame = (robot.curFrame + 1) % sequence.length;
    
  robot.ct = (robot.ct + 1) % robot.fps;
}
function renderrobot(robot){
  //set the animation sequence
  var sequence;
  if(robot.dir == "north"){
    if(robot.action == "idle")
      sequence = robot.idleNorth;
    else 
      sequence = robot.moveNorth;
  }
  else if(robot.dir == "south"){
    if(robot.action == "idle")
      sequence = robot.idleSouth;
    else 
      sequence = robot.moveSouth;
  }
  else if(robot.dir == "west"){
    if(robot.action == "idle")
      sequence = robot.idleWest;
    else 
      sequence = robot.moveWest;
  }
  else if(robot.dir == "east"){
    if(robot.action == "idle")
      sequence = robot.idleEast;
    else 
      sequence = robot.moveEast;
  }
  
  //get the row and col of the current frame
  var row = Math.floor(sequence[robot.curFrame] / robot.fpr);
  var col = Math.floor(sequence[robot.curFrame] % robot.fpr);
  
  if(robot.show){
    ctx.drawImage(robot.img, 
    col * robot.width, row * robot.height, 
    robot.width, robot.height,
    robot.x - 8, robot.y - 4, 
    robot.width, robot.height);
  }
}

function drawArrow(robot){
  if(arrowReady && arrowShow){
    ctx.drawImage(arrowIMG, 
      0, 0, 
      16, 12,
      robot.x, robot.y -16, 
      16, 12);
  }
}

//overall rendering function
function render(){
  ctx.save();
  
  //clear everything
  ctx.clearRect(0, 0, canvas.width,canvas.height);
  
  //re-draw bg
  var ptrn = ctx.createPattern(bgPNG, 'repeat'); // Create a pattern with this image, and set it to "repeat".
  ctx.fillStyle = ptrn;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  //draw the map
  drawMap();

  //draw tree trunk
  drawTreeBottom();

  //draw the items
  //drawItems();

  //draw the robot
  drawBot();

  //draw tree tops
  drawTreeTop();

    drawItems();

  //draw the arrow to find the robot
  drawArrow(bot);

  ctx.restore();
  requestAnimationFrame(render);
    
}


////////////         SIMULATION FUNCTIONS         //////////

function init(){
  makeACompass(bot, 'a');
  if(localStorage.simulCt)
    localStorage.simulCt++;
  else{
    localStorage.simulCt = 1;
  }
}
init();

function main(){
	requestAnimationFrame(main);
  canvas.focus();

  //drunkardsWalk();

  travel(bot);
  smallStep(bot);
  terrainTrek(bot);
  finderArrow(bot);
  atWorldsEnd(bot);
  pickup(bot);

  if(useCompass && !moving)
    compass(bot);

  //settings debugger screen
  var pixX = Math.round(bot.x / size);
  var pixY = Math.round(bot.y / size);
  var obj;
  if(bot.thinkIndex < bot.brain.length)
    obj = bot.brain[bot.thinkIndex];
  else
    obj = "edge";

  var settings = "X: " + Math.round(bot.x) + " | Y: " + Math.round(bot.y);
  settings += " --- Pix X: " + pixX + " | Pix Y: " + pixY;
  settings += " ---- Compass: " + obj;
  document.getElementById('botSettings').innerHTML = settings;
}


//log functions
function newLog(statement){
  log += statement + "\n";
}
function downloadLog(){
  var blob = new Blob([log], {type:"text/plain"});
  var urlObj = window.URL.createObjectURL(blob);

  var simulCt = localStorage.simulCt;
  var fileName = "simulation_" + simulCt + ".log";


  var downloader = document.createElement("a");
  downloader.download = fileName;
  downloader.innerHTML = "DOWNLOAD";
  downloader.href = urlObj;
  downloader.onclick = destroyBtn;
  downloader.style.display = "none";
  document.body.appendChild(downloader);
  downloader.click();

}

function destroyBtn(ev){
  document.body.removeChild(ev.target);
}

//stops the simulation
var run = true;
function stop(){
  newLog("----SIMULATION FINISH----");
  run = false;
  useCompass = false;
}

if(run)
  main();

render();