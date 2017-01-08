////////////////////////
///   BST MOVEMENT   ///
///   PATHFINDING    ///
////////////////////////

function gotoDumb(robot, target, map){
  //if no target move on
  if(target == null)
    return "done";
  

  //function variables
  var frontier = [];
  var closedCells = [];
  var index = 0;
  var parents = [];

  //position variables
  var robotX = Math.floor(robot.x / 16);
  var robotY = Math.floor(robot.y / 16);
  var targetX = target.x;
  var targetY = target.y ;
  var robotPos = [robotX, robotY];
  var targetPos = [targetX, targetY];

  //add initial position to the sets
  frontier.push(robotPos);
  closedCells.push(robotPos);

  //////   BFS algorithm  ////////
  while(index < frontier.length){
    findAreaBFS(index, frontier, closedCells, parents, map);
  }

  //make a path from the area
  var path = findPath(robotPos, targetPos, closedCells, parents);
  //if the path isn't unreachable or empty
  if(!arrEq(path[0], [-1,-1]) && path.length != 0){
    //make next decision
    return followPath(robotPos, path[path.length - 1]);
  }else{
    //cannot move anywhere
    return "done";
  }
}

function findAreaBFS(index, frontier, closedCells, parents, map){
  if(index < frontier.length){
    var neighbors = getMapNeighbors(frontier[index], map);

    for(var t = 0; t < neighbors.length; t++){
      if(!inClosedCells(neighbors[t], closedCells)){
        closedCells.push(neighbors[t]);
        frontier.push(neighbors[t]);
        if(!inParents(neighbors[t], parents)){
          var family = [frontier[index], neighbors[t]];     //parent then child
          parents.push(family);
        }
      }
    }
      
    index++;
  }
}

//decide to go north, south, east, or west
function followPath(curPos, nextPos){
  var curX = curPos[0];
  var curY = curPos[1];
  var nextX = nextPos[0];
  var nextY = nextPos[1];

  //if the same position
  if(arrEq(curPos, nextPos))
    return "done";

  //otherwise use a compass
  if(curX == nextX){
    if(nextY < curY){
      return "north";
    }else if(nextY > curY){
      return "south";
    }
  }else if(curY == nextY){
    if(nextX > curX){
      return "west";
    }else if(nextX < curX){
      return "east";
    }
  }
}

//get the north, south, east, and west positions of the node from the map
function getMapNeighbors(pos, map){
  var neighbor = [];
  var north = [pos[0], pos[1]-1];
  var east = [pos[0]+1, pos[1]];
  var south = [pos[0], pos[1]+1];
  var west = [pos[0]-1, pos[1]];

  //check if the nodes exist - if so, add them to the neighbor list
  if(((pos[1] - 1) >= 0) && (map[pos[1] -1][pos[0]] != 1))
    neighbor.push(north);
  if(((pos[0] - 1) >= 0) && (map[pos[1]][pos[0] - 1] != 1))
    neighbor.push(west);
  if(((pos[1] + 1) < map.length) && (map[pos[1] +1][pos[0]] != 1))
    neighbor.push(south);
  if(((pos[0] + 1) < map[0].length) && (map[pos[1]][pos[0] + 1] != 1))
    neighbor.push(east);
  
  return neighbor;
}

//checks if node is in the closedCell array
function inClosedCells(pos, cc){
  for(var v = 0; v < cc.length; v++){
    if(arrEq(pos, cc[v]))
      return true;
  }
  return false;
}

//check if node is in the parents array
function inParents(pos, parents){
  for(var v = 0; v < parents.length; v++){
    for(var o = 0; o < parents[v].length; o++){
      if(arrEq(pos, parents[v][o]))
        return true;
    }
  }
  return false;
}

//cc = closedCells, p = parents
function findPath(start, end, cc, p){
  var path = []
  if(inClosedCells(end, cc)){
    while(!arrEq(end, start)){
      path.push(end);
      end = findParents(end, p);
    }
    return path;
  }
  return [[-1,-1]];
}

//finds the original parent of a particular node
function findParents(child, parents){
  for(var y = 0; y < parents.length; y++){
    var dad = parents[y][0];
    var kid = parents[y][1];
    if(arrEq(kid, child)){
      return dad;
    }
  }
  return [-1,-1];
}

//checks if two arrays are equivalent based on the elements
function arrEq(arr1, arr2){
  for(var p = 0; p < arr1.length; p++){
    if(arr1[p] !== arr2[p])
      return false
  }
  return true;
}