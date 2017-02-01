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

///////////////    ROBOT VARIABLES    ///////////////

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
  offsetX : 8,
  offsetY : 4,

  //advance properties
  health : 100,
  maxHealth : 100,
  lowHealth : (1/2),
  hurt : false,
  grace : null,
  maxGrace : 2,
  damage : 5,
  wallet : 0,
  minCash : 0,
  weapon : null,

  //pathfinding properties
  target : null,
  priority : "none",
  pathQueue : [],
  route : "dumb",
  brain : [],
  thinkIndex : 0,
  nextWorld : false,
  danger : false,

  //collection values
  kills : 0,
  moneyCol : 0,
  foodCol : 0,
  levels : 0,

  //movement
  speed : 2,
  maxSpeed : 2,
  initPos : 0,
  moving : false,
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

//grave
var graveIMG = new Image();
graveIMG.src = "sprites/grave.png";
var graveReady = false;
graveIMG.onload = function(){graveReady = true;}

//knight image properties
var knightIMG = new Image();
knightIMG.src = "sprites/knight2.png";
var knightReady = false;
knightIMG.onload = function(){knightReady = true;};

//knight object
function Knight(name, x, y, patrolType){
  //sprite properties
  this.name = name;
  this.width = 16;
  this.height = 20;
  this.dir = "south";
  this.action= "idle";
  this.img = knightIMG;
  this.ready = knightReady;
  this.offsetX = 0;
  this.offsetY = 4;

  //weapon and health properties
  this.health = 20;
  this.hurt = false;
  this.grace = null;
  this.maxGrace = 2;
  this.damage = 10;

  //path finding properties
  this.target = null;
  this.priority = "none";
  this.pathQueue = [];
  this.route = "dumb";
  this.brain = [];
  this.thinkIndex = 0;
  this.patrolType = patrolType;
  this.radius = Math.floor(Math.random() * 4) + 3;;

  //movement
  this.maxSpeed = Math.floor(Math.random() * 2) + 1;
  this.speed = this.maxSpeed;
  this.initPos = 0;
  this.moving = false;
  this.x = x * size; 
  this.y = y * size;
  this.velX = 0;
  this.velY = 0;
  this.fps = 4;            //frame speed
  this.fpr = 12;           //# of frames per row
  this.show = true;
  
  //animation
  this.idleNorth = [4,4,4,4];
  this.idleSouth = [1,1,1,1];
  this.idleWest = [7,7,7,7];
  this.idleEast = [10,10,10,10];
  this.moveNorth = [3,4,5,4];
  this.moveSouth = [0,1,2,1];
  this.moveWest = [6,7,8,7];
  this.moveEast = [9,10,11,10];
  this.curFrame = 0;
  this.ct = 0;
}
//set of knights
var army = [];
  
//arrow sprite
var arrowIMG = new Image();
var arrowReady = false;
var arrowShow = false;
arrowIMG.src = "sprites/arrow.png";
arrowIMG.onload = new function(){arrowReady = true;}

//set of bots
var allBots = [];

//simulation variables
var log = "----SIMULATION START----\n";
var time = 0;
var start = new Date();

//////////////////////       ITEM FUNCTIONS       //////////////

var itemSet = [];
var foodSet = [];
var moneySet = [];
var weaponSet = [];

//generic function for all items
function item(name, x, y){
  this.name = name;
  this.x = x * 16;
  this.y = y * 16;
  this.show = true;
  this.img;
  this.imgReady;
  this.dispX = 0;
  this.dispY = 0;
  this.imageW;
  this.imageH;
  this.spec;
  this.value;
  this.offset = 0;
  this.size;
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
gemIMG.src = "sprites/gems2.png";
gemIMG.onload = new function(){gemReady = true;}

var gemList = ["copper", "sapphire", "emerald", "ruby",
              "bronze", "silver", "gold", "platinum", "diamond"];

////////   item functions   ////////
//resets all the groups
function resetSets(){
  itemSet = [];
  foodSet = [];
  moneySet = [];
  weaponSet = [];
  army = [];
  allBots = [];
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
        it.imageW = it.img.width;
        it.imageH = it.img.height;
        it.spec = "health";
        it.value = 10;
      }
      itemSet.push(it);
      foodSet.push(it);
    }
  }
}

//generate money objects
function makeMoney(max){
  var genNum = Math.floor(Math.random() * (max + 1));
  for(var n = 0; n < genNum; n++){
    var cashType = randomCash();
    var x = Math.floor(Math.random() * cols);
    var y = Math.floor(Math.random() * rows);
    var it;
    if(cashType == "jackpot"){
      it = new item(cashType, x, y);
      it.img = moneyIMG;
      it.imgReady = moneyReady;
      it.dispX = 1;
      it.dispY = 1;
      it.imageW = it.img.width;
      it.imageH = it.img.height;
      it.spec = "jackpot";
      it.value = 250;
    }else{
      it = new item(cashType, x, y);
      it.img = gemIMG;
      it.imgReady = gemReady;
      it.dispX = 5;
      it.dispY = 5;
      it.imageW = 6;
      it.imageH = 6;
      it.spec = "gem";
      it.value = getMoneyValue(cashType);
      it.offset = getGemOffset(cashType) * it.imageW;
    }
    itemSet.push(it);
    moneySet.push(it);
  }
}  

//returns the gem based on the probability
function randomCash(){
  var gemProb = Math.floor(Math.random() * 101);
  if(gemProb < 50)
    return "copper";
  else if(gemProb < 59)
    return "sapphire";
  else if(gemProb < 68)
    return "emerald";
  else if(gemProb < 77)
    return "ruby";
  else if(gemProb < 86)
    return "bronze";
  else if(gemProb < 91)
    return "silver";
  else if(gemProb < 95)
    return "gold";
  else if(gemProb < 97)
    return "platinum";
  else if(gemProb < 99)
    return "diamond";
  else 
    return "jackpot";
}

//returns monetaoy value
function getMoneyValue(name){
  if(name == "copper")
    return 1;
  else if(name == "sapphire")
    return 5;
  else if(name == "emerald")
    return 5;
  else if(name == "ruby")
    return 5;
  else if(name == "bronze")
    return 5;
  else if(name == "silver")
    return 10;
  else if(name == "gold")
    return 25;
  else if(name == "platinum")
    return 50;
  else if(name == "diamond")
    return 100;
}

//return offset of the gem
function getGemOffset(gem){
  for(var g = 0; g < gemList.length; g++){
    if(gem == gemList[g])
      return g;
  }
  return 0;
}


//organize items by categooy
function organizeItems(){
  for(var a = 0; a < itemSet.length; a++){
    var myItem = itemSet[a];
    if(myItem.name == "apple")
      foodSet.push(myItem);
    else if(myItem.spec == "gem" || myItem.spec == "jackpot")
      moneySet.push(myItem);
  }
}

//have a bot pick up said item
function pickup(robot){
  for(var a = 0; a < itemSet.length; a++){
    var myItem = itemSet[a];
    if(isTouching(robot, myItem) && myItem.show){
      newLog(myItem.name + " get!");

      if(inArr(myItem, foodSet)){
        if(robot.health < 100){
          newLog(myItem.value + " health restored!");
          robot.health += myItem.value;
        }
        robot.foodCol++;
      }
      else if(inArr(myItem, moneySet)){
        robot.moneyCol++;
        robot.wallet += myItem.value;
      }

      myItem.show = false;
    }
  }
}

//check if collision on same tile with item and robot
function isTouching(robot, item){
  var botX = Math.round(robot.x / size);
  var botY = Math.round(robot.y / size);
  var itemX = Math.round(item.x / size);
  var itemY = Math.round(item.y / size);

  if(botX == itemX && botY == itemY)
    return true;
  else
    return false;
}

//check if a certain item is in a certain group
function inArr(item, group){
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
	for(var a = 0; a < rowows; a++){
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
    robot.initPos = rows * size;
  }else if(direction == "south"){       //spawn at the top
    robot.y = -halfTile;
    robot.initPos = -size;
  }else if(direction == "west"){        //spawn at the right
    robot.x = cols * size - halfTile;
    robot.initPos = cols * size;
  }else if(direction == "east"){        //spawn at the left
    robot.x = -halfTile;
    robot.initPos = -size;
  }

  
  blankMap();
  resetSets();
  addNature(3, 1, 0.2, 0.01);               //water
  addNature(4, 3, 0.25, 0.02);              //tree
  makeFoods([new itemProb("apple", 2)]);    //foods
  makeMoney(7);                             //money
  ariseSir(80, 4);                         //knights
  resetBot(bot);
  newLog("next world!");
  bot.levels++;
}
//generates a new world map with bot starting from a point
function braveNewWorld2(robot, x, y, spec){
  robot.x = size * x;
  robot.y = size * y;
  robot.moving = false;
  blankMap(); 
  resetSets();
  resetBot(bot);
  addNature(3, 1, 0.2, 0.01);                //water
  addNature(4, 3, 0.25, 0.02);               //tree
  makeFoods([new itemProb("apple", 2)]);     //foods 
  makeMoney(7);
  ariseSir(80, 4);
}

//start screen
braveNewWorld2(bot, 9, 9, "none");


///////////////            BOT FUNCTIONS             ///////////

function resetBot(robot){
  robot.thinkIndex = 0;
  robot.pathQueue = [];
  robot.nextWorld = false;
  allBots.push(robot);
}

function goNorth(robot){
  if(!robot.moving){
    robot.initPos = Math.floor(robot.y / size) * size;
    robot.dir = "north";
    robot.action = "travel";
  }
}
function goSouth(robot){
  if(!robot.moving){
    robot.initPos = Math.floor(robot.y / size) * size;
    robot.dir = "south";
    robot.action = "travel";
  }
}
function goEast(robot){
  if(!robot.moving){
    robot.initPos = Math.floor(robot.x / size) * size;
    robot.dir = "east";
    robot.action = "travel";
  }
}
function goWest(robot){
  if(!robot.moving){
    robot.initPos = Math.floor(robot.x / size) * size;
    robot.dir = "west";
    robot.action = "travel";
  }
}
function travel(robot){
  if(robot.action == "travel"){   //continue if allowed to move
    //travel north
    if(robot.dir == "north"){
      if(Math.floor(robot.y) > (robot.initPos - size)){
        robot.velY = robot.speed;
        robot.y += velControl(Math.floor(robot.y), -robot.velY, (robot.initPos - size));
        robot.moving = true;
      }else{
        robot.velY = 0;
        robot.action = "idle";
        robot.moving = false;
      }
    }else if(robot.dir == "south"){
      if(Math.floor(robot.y) < (robot.initPos + size)){
        robot.velY = robot.speed;
        robot.y += velControl(Math.floor(robot.y), robot.velY, (robot.initPos + size));;
        robot.moving = true;
      }else{
        robot.velY = 0;
        robot.action = "idle";
        robot.moving = false;
      }
    }else if(robot.dir == "east"){
      if(Math.floor(robot.x) < (robot.initPos + size)){
        robot.velX = robot.speed;
        robot.x += velControl(Math.floor(robot.x), robot.velX, (robot.initPos + size));
        robot.moving = true;
      }else{
        robot.velX = 0;
        robot.action = "idle";
        robot.moving = false;
      }
    }else if(robot.dir == "west"){
      if(Math.floor(robot.x) > (robot.initPos - size)){
        robot.velX = robot.speed;
        robot.x += velControl(Math.floor(robot.x), -robot.velX, (robot.initPos - size));;
        robot.moving = true;
      }else{
        robot.velX = 0;
        robot.action = "idle";
        robot.moving = false;
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
    return 1;
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
  if(robot.pathQueue.length != 0 && !robot.moving){       //if not already moving and not an empty pathQueue
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


//import the actions
function makeACompass(robot, set){
  for(var a = 0; a < botSets.length; a++){
    if(botSets[a].name == set){
      robot.brain = botSets[a].actions;
    }
  }
}

//import the stats
function setStats(robot, set){
  for(var s = 0; s < botStats.length; s++){
    if(botStats[s].name == set){
      var properties = botStats[s].props;
      for(var p = 0; p < properties.length; p++){
        var prop = properties[p];
        if(prop.id == "maxHealth")
          robot.maxHealth = prop.val;
        else if(prop.id == "minMoney")
          robot.minCash = prop.val; 
        else if(prop.id == "pathFind")
          robot.route = prop.val;
        else if(prop.id == "danger")
          robot.danger = prop.val;
        else if(prop.id == "lowHealth")
          robot.lowHealth = prop.val;
      }
    }
  }
}

//decides what to do next
function compass(robot){
  if(robot.nextWorld){
    processDir(robot, gotoEdge(robot));
  }
  else{
    var objective = think(robot, 0);
    if(objective != "edge"){
      //run away if low health
      if(robot.priority != "health" && robot.danger && (robot.health <= (robot.maxHealth * robot.lowHealth)))
        robot.nextWorld = true;
      //otherwise complete objective
      else
        processDir(robot, objective);
    }else{
      robot.nextWorld = true;
    } 
  }
}

//decides based on action priority
function think(robot, step){
  if(step >= robot.brain.length)
    return "edge";
  else{
    robot.priority = robot.brain[step];
    if(robot.brain[step] == "health"){
      if(gotoClosest(robot, foodSet) != null && robot.health < robot.maxHealth)
        return gotoDumb(robot, gotoClosest(robot, foodSet), map, size);
      else
        return think(robot, step+1);
    }else if(robot.brain[step] == "money"){
      if(gotoClosest(robot, moneySet) != null)
        return gotoDumb(robot, gotoClosest(robot, moneySet), map, size);
      else
        return think(robot, step+1);
    }else if(robot.brain[step] == "weapons"){
      if(gotoClosest(robot, weaponSet) != null && robot.weapon == null)
        return gotoDumb(robot, gotoClosest(robot, weaponSet), map, size);
      else
        return think(robot, step+1);
    }else if(robot.brain[step] == "blood"){
      if(gotoClosest(robot, army) != null && robot.weapon != null)
        return gotoDumb(robot, gotoClosest(robot, army), map, size);
      else
        return think(robot, step+1);
    }
  }
  
}

//decides how to walk
var useCompass = true;

/*
function compass(robot){
  //if out of options
  if(robot.thinkIndex >= robot.brain.length){
    processDir(robot, gotoEdge(robot));
  }

  var plan = robot.brain[robot.thinkIndex];
  robot.priority = plan;
  var objective = think(robot, plan);
  if(objective == "done"){
    robot.thinkIndex++;
  }else{
    processDir(robot, objective);
  }
}

//brain blast!
function think(robot, action){
  if(robot.health < (robot.maxHealth / 3)){
    var lifesaver = gotoClosest(robot, foodSet);
    if(lifesaver != null)
      return gotoDumb(robot, lifesaver, map, size);
    else
      return "done";
  }
  else if(action == "health"){
    return gotoDumb(robot, gotoClosest(robot, foodSet), map, size);
  }else if(action == "money"){
    return gotoDumb(robot, gotoClosest(robot, moneySet), map, size);
  }else{
    return "done";
  }
}
*/

//decide which was to go based on the direction given
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
  if(!robot.moving){
    dice = Math.floor(Math.random() * 4);
    if(dice == 0){
      goNorth(robot);
    }else if(dice == 1){
      goSouth(robot);
    }else if(dice == 2){
      goWest(robot);
    }else if(dice == 3){
      goEast(robot);
    }
  }
}

//random walking path based
function drunkardsWalkPath(robot){
  var initX = Math.floor(robot.x / 16);
  var initY = Math.floor(robot.y / 16);
  robot.pathQueue = [];

  //make waypoints
  var dice = Math.floor(Math.random() * 4);
  if(dice == 0){
    robot.pathQueue.push([initX, initY - 1]);
  }else if(dice == 1){
    robot.pathQueue.push([initX, initY + 1]);
  }else if(dice == 2){
    robot.pathQueue.push([initX + 1, initY]);
  }else if(dice == 3){
    robot.pathQueue.push([initX - 1, initY]);
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
      var itemX = Math.floor(goodSet[d].x / size);
      var itemY = Math.floor(goodSet[d].y / size);

      var distX = Math.abs(botX - itemX);
      var distY = Math.abs(botY - itemY);
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


//////////////////////      KNIGHT FUNCTIONS       //////////////

//make a knight
function ariseSir(prob, max){
  for(var k = 0; k < max; k++){
    var randNum = Math.floor(Math.random() * 101);
    if(randNum < prob){     //make a knight!
      var x = Math.floor(Math.random() * cols);
      var y = Math.floor(Math.random() * rows);

      var p = Math.floor(Math.random() * 5);
      var patrol = (p == 0 ? "drunk" : "sober");

      var sir = new Knight("knight" + k, x, y, patrol);
      army.push(sir);
      allBots.push(sir);
    }
  }
}

//patrol the area or chase the goblin
function guard(knight, robot){
  if(knight.target == null)
    knight.target = intruder(knight, robot, knight.radius, true);

  if(knight.target == robot){
    knight.pathQueue = [];
    processDir(knight, gotoDumb(knight, knight.target, map, size));
  }
  
  else if(knight.pathQueue.length == 0){
    if(knight.patrolType == "drunk")
      drunkardsWalkPath(knight);
    else if(knight.patrolType == "sober")
      circleUp(knight, knight.radius);
  }
  
}

//have a knight check for any goblins
function intruder(knight, robot, view, treeBlock){
  //if already in sight - double the view
  if(knight.target == robot)
    view *= 2;

  //get the knight's direction and view # spaces in between
  var rx = Math.round(knight.x / size);
  var ry = Math.round(knight.y / size);
  var los = [];
  for(var i = 1; i <= view; i++){
    var pos = [];
    if(knight.dir == "north")
      pos = [rx, ry-i];
    else if(knight.dir == "south")
      pos = [rx, ry+i];
    else if(knight.dir == "west")
      pos = [rx-i, ry];
    else if(knight.dir == "east")
      pos = [rx+i, ry];

    los.push(pos);
  }

  //check if the robot is on one of those spaces
  var ox = Math.round(robot.x / size);
  var oy = Math.round(robot.y / size);
  var rpos = [ox, oy];

  for(var r = 0; r < los.length; r++){
    if(arrEq(los[r], rpos)){
      if(!treeBlock || map[los[r][0]][los[r][1]] !== 3){
        if(knight.target == null){
          console.log(knight.name + ": HALT!")  //first saw goblin
          knight.pathQueue = [];                //clear original path
        }
        return robot;           //return new target if so
      }
    }
  }
  return null;                //no target found
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

//determine if colliding with an object
function objCollide(robot, obj){
  //get the positions
  var rx = Math.round(robot.x / size);
  var ry = Math.round(robot.y / size);
  var ox = Math.round(obj.x / size);
  var oy = Math.round(obj.y / size);

  //decide if adjacent to robot
  if(robot.dir == "north" && (rx == ox) && ((oy+1) == ry))
    return true;
  else if(robot.dir == "south" && (rx == ox) && ((oy-1) == ry))
    return true;
  else if(robot.dir == "east" && (ry == oy) && ((ox-1) == rx))
    return true;
  else if(robot.dir == "west" && (ry == oy) && ((ox+1) == rx))
    return true;
  else if(rx == ox && ry == oy)
    return true;
  else
    return false;
}
//determine if colliding with an object
function objCollideSet(robot, set){
  //get the positions
  var rx = Math.round(robot.x / size);
  var ry = Math.round(robot.y / size);

  for(var o = 0; o < set.length; o++){
    var obj = set[o];
    var ox = Math.round(obj.x / size);
    var oy = Math.round(obj.y / size);

    //decide if adjacent to robot
    if(robot.dir == "north" && (rx == ox) && ((oy+1) == ry))
      return true;
    else if(robot.dir == "south" && (rx == ox) && ((oy-1) == ry))
      return true;
    else if(robot.dir == "east" && (ry == oy) && ((ox-1) == rx))
      return true;
    else if(robot.dir == "west" && (ry == oy) && ((ox+1) == rx))
      return true;
    else if(rx == ox && ry == oy)
      return true;
  }
  return false;
}

//battler
function attack(attacker, victim){
  if(objCollide(attacker, victim) && !victim.hurt && !attacker.moving){
    console.log(attacker.name + ": ATTACK!");
    hurt(victim, attacker.damage);
  }
}

//take damage
function hurt(robot, damage){
  robot.health -= damage;
  newLog(robot.name + " took " + damage + " damage");
  robot.hurt = true;
  robot.grace = setTimeout(function(){gracePeriod(robot)}, robot.maxGrace*1000);
}

//reset the grace period to take more damage
function gracePeriod(robot){
  clearTimeout(robot.grace);
  robot.hurt = false;
}

//check if 2 arrays are equal
function arrEq(arr1, arr2){
  if(arr1.length != arr2.length)
    return false;

  for(var a = 0; a < arr1.length; a++){
    if(arr1[a] != arr2[a])
      return false;
  }
  return true;
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
      ctx.drawImage(it.img, it.offset, 0, 
                it.imageW, it.imageH,
                (it.x) + it.dispX, 
                (it.y) + it.dispY,
                it.imageW, it.imageH);
    }
  }
}

//rendering functions for the characters
function drawBot(){
    updaterobot(bot);
    renderrobot(bot);
}

function drawKnight(){
  for(var k = 0; k < army.length; k++){
    updaterobot(army[k]);
    renderrobot(army[k]);
  }
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
    robot.x - robot.offsetX, robot.y - robot.offsetY, 
    robot.width, robot.height);
  }else{
    ctx.drawImage(graveIMG, robot.x, robot.y);
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
  
  //clear eveoything
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

  //draw the knights
  drawKnight();

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
  setStats(bot, "a");
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

  //generic robot functions
  for(var b = 0; b < allBots.length; b++){
    var robot = allBots[b];
    travel(robot);
    terrainTrek(robot);
  }

  //goblin robot
  //if(!objCollideSet(bot, army))
  if(run)
    smallStep(bot);

  finderArrow(bot);
  atWorldsEnd(bot);
  pickup(bot);

  if(bot.health <= 0 && run){
    bot.show = false;
    stop(); 
  }

  //knight robots
  for(var k = 0; k < army.length; k++){
    guard(army[k], bot);
    attack(army[k], bot);
    if(!objCollide(army[k], bot) && run)
      smallStep(army[k]);
  }
  
  
  if(useCompass && !bot.moving)
    compass(bot);

  if(bot.health > bot.maxHealth)
    bot.health = bot.maxHealth

  //settings debugger screen
  var pixX = Math.round(bot.x / size);
  var pixY = Math.round(bot.y / size);
  var obj;
  if(bot.nextWorld)
    obj = "edge";
  else
    obj = bot.priority;

  var settings = "X: " + Math.round(bot.x) + " | Y: " + Math.round(bot.y);
  settings += " --- Pix X: " + pixX + " | Pix Y: " + pixY;
  settings += " ---- Compass: " + obj;
  document.getElementById('botSettings').innerHTML = settings;

  //simulation update
  if(run)
    time = new Date() - start;
}


//log functions
function newLog(statement){
  if(run)
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
  newLog("----SIMULATION FINISH----\n\n");
  newLog(getBotStats(bot));
  run = false;
  useCompass = false;
}

//gets the status of a robot
function getBotStats(robot){
  var st = "";
  st += "Bot : " + robot.name.toUpperCase() + "\n";
  st += "-> Health : " + robot.health + "\n";
  st += "-> Wallet : " + robot.wallet + "\n";
  st += "-> Weapon : " + robot.weapon + "\n";
  st += "-> Kills  : " + robot.kills + "\n";
  st += "-> Time   : " + (time / 1000) + "s\n";
  st += "\n\n";
  st += "Money picked up: " + robot.moneyCol + "\n";
  st += "Items picked up: " + robot.foodCol + "\n";
  st += "Worlds traveled: " + robot.levels + "\n";

  return st;
}

main();
render();