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
function Animation(image, sequence, fps, fpr, w, h){
  var ct = 0;
  var curFrame = 0;
  
  this.update = function(){
    //update the frames
    if(ct == (fps - 1))
      curFrame = (curFrame + 1) % sequence.length;
      
    ct = (ct + 1) % fps;
  };
  this.draw = function(x,y){
    //get the row and col of the current frame
    var row = Math.floor(sequence[curFrame] / fpr);
    var col = Math.floor(sequence[curFrame] % fpr);
    
    //draw it
    ctx.drawImage(image, 
      col * w, row * h, 
      w, h,
      x, y, 
      w, h);
  };
}
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

  ctx.restore();
  requestAnimationFrame(render);
    
}

////////////        SIMULATION FUNCTIONS          //////////

function main(){
	requestAnimationFrame(main);
  	canvas.focus();
}

main();
render();