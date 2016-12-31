var frontier = [];
      var start = [npc.x, npc.y];
      frontier.push(start);
      var closedCells = [];
      closedCells.push(start);
      var index = 0;
      
      var parents = [];
      
      
      function test(){
        var playerPos = [player.x, player.y];
        var npcPos = [npc.x, npc.y];
        var current = playerPos;
        
        frontier = [];
        start = [npc.x, npc.y];
        frontier.push(start);
        closedCells = [];
        closedCells.push(start);
        index = 0;
        
        parents = [];
        while(index < frontier.length){
          findArea();
        }
        var enemyPath = findPath(npcPos, playerPos);
        if(!arrEq(enemyPath[0], [-1,-1])){
          npc.x = enemyPath[enemyPath.length - 1][0];
          npc.y = enemyPath[enemyPath.length - 1][1];
        }else{
          console.log("Unreachable");
        }
      }
      function findPath(start, end){
        var path = []
        if(inClosedCells(end)){
          while(!arrEq(end, start)){
            path.push(end);
            end = findParents(end);
          }
          return path;
        }
        return [[-1,-1]];
      }
      function findParents(child){
        for(var y = 0; y < parents.length; y++){
          var dad = parents[y][0];
          var kid = parents[y][1];
          if(arrEq(kid, child)){
            return dad;
          }
        }
        return [-1,-1];
      }
      
      function findArea(){
        if(index < frontier.length){
          var neighbors = getNeighbors(frontier[index]);
          
          var prtOut = "Rank: " + index + "\tPos: " + frontier[index] + "\tSpawn: ";
          for(var o = 0; o < neighbors.length; o++){
            prtOut += neighbors[o] + " ";
          }
          
          var pInd = 0;
          for(var t = 0; t < neighbors.length; t++){
            if(!inClosedCells(neighbors[t])){
              closedCells.push(neighbors[t]);
              frontier.push(neighbors[t]);
              //prtOut += neighbors[t] + " ";
              if(!inParents(neighbors[t])){
                var family = [frontier[index], neighbors[t]];     //parent then child
                parents.push(family);
                //console.log(parents[pInd][0] + ", " + parents[pInd][1]);
                pInd++;
              }
            }
            
          }
          console.log(prtOut);
          
          index++;
        }else{
          console.log("all done :P");
        }
      }
      function getNeighbors(pos){
        var neighbor = [];
        var north = [pos[0], pos[1]-1];
        var east = [pos[0]+1, pos[1]];
        var south = [pos[0], pos[1]+1];
        var west = [pos[0]-1, pos[1]];
        if(((pos[1] - 1) >= 0) && (curMap[pos[1] -1][pos[0]] != 1))
          neighbor.push(north);
        if(((pos[0] - 1) >= 0) && (curMap[pos[1]][pos[0] - 1] != 1))
          neighbor.push(west);
        if(((pos[1] + 1) < curMap.length) && (curMap[pos[1] +1][pos[0]] != 1))
          neighbor.push(south);
        if(((pos[0] + 1) < curMap[0].length) && (curMap[pos[1]][pos[0] + 1] != 1))
          neighbor.push(east);
        
        return neighbor;
      }
      
      function inClosedCells(pos){
        for(var v = 0; v < closedCells.length; v++){
          if(arrEq(pos, closedCells[v]))
            return true;
        }
        return false;
      }
      function inParents(pos){
        for(var v = 0; v < parents.length; v++){
          for(var o = 0; o < parents[v].length; o++){
            if(arrEq(pos, parents[v][o]))
              return true;
          }
        }
        return false;
      }
      
      function arrEq(arr1, arr2){
        for(var p = 0; p < arr1.length; p++){
          if(arr1[p] !== arr2[p])
            return false
        }
        return true;
      }