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
terrain.src = "sprites/mapGrid3.png";
var terrainReady = false;
terrain.onload = function(){
  terrainReady = true;
  randomMap();
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
  //properties
  name : "shu",
  width : 32,
  height : 20,
  dir : "west",
  action: "idle",
  img : botIMG,
  ready : botReady,
  //movement
  speed : 2,
  x : 10 * size, 
  y : 10 * size,
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
//blankMap();

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
}//rendering functions for the characters
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
    robot.x - 8, robot.y + 12, 
    robot.width, robot.height);
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

  //draw the robot
  drawBot();

  ctx.restore();
  requestAnimationFrame(render);
    
}


////////////            BOT FUNCTIONS             ///////////
var initPos;
var moving;
function goNorth(robot){
  if(!moving){
    initPos = Math.floor(robot.y);
    robot.dir = "north";
    robot.action = "travel";
  }
}
function goSouth(robot){
  if(!moving){
    initPos = Math.floor(robot.y);
    robot.dir = "south";
    robot.action = "travel";
  }
}
function goEast(robot){
  if(!moving){
    initPos = Math.floor(robot.x);
    robot.dir = "east";
    robot.action = "travel";
  }
}
function goWest(robot){
  if(!moving){
    initPos = Math.floor(robot.x);
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
        robot.y -= robot.velY;
        moving = true;
      }else{
        robot.velY = 0;
        robot.action = "idle";
        moving = false;
      }
    }else if(robot.dir == "south"){
      if(Math.floor(robot.y) < (initPos + size)){
        robot.velY = robot.speed;
        robot.y += robot.velY;
        moving = true;
      }else{
        robot.velY = 0;
        robot.action = "idle";
        moving = false;
      }
    }else if(robot.dir == "east"){
      if(Math.floor(robot.x) < (initPos + size)){
        robot.velX = robot.speed;
        robot.x += robot.velX;
        moving = true;
      }else{
        robot.velX = 0;
        robot.action = "idle";
        moving = false;
      }
    }else if(robot.dir == "west"){
      if(Math.floor(robot.x) > (initPos - size)){
        robot.velX = robot.speed;
        robot.x -= robot.velX;
        moving = true;
      }else{
        robot.velX = 0;
        robot.action = "idle";
        moving = false;
      }
    }
  }
}


////////////         SIMULATION FUNCTIONS         //////////

function main(){
	requestAnimationFrame(main);
  canvas.focus();

  travel(bot);

  //settings debugger screen
  var pixX = Math.floor(bot.x) / size;
  var pixY = Math.floor(bot.y) / size;

  var settings = "X: " + Math.round(bot.x) + " | Y: " + Math.round(bot.y);
  settings += " --- Pix X: " + pixX + " | Pix Y: " + pixY;
  document.getElementById('botSettings').innerHTML = settings;
}

main();
render();