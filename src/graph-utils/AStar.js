import Graph from './Graph.js';

class AStar extends Graph{
  search(){
    /* Dist stores the distance from the start node to all other nodes
     * SptSet stores all nodes visited by the search
     * Parents stores for each node its parent in the path back to the starting node
     * visited stores the order in which nodes were visited by the searching algoerithm
     */
    var dist = new Array(this.num_nodes).fill(1000000);
    var sptSet = new Array(this.num_nodes).fill(false);
    var parents = new Array(this.num_nodes).fill(0);
    var visited = [];

    dist[this.start_node] = 0;
    parents[this.start_node] = -1;

    /* Perform the search */
    for(var count = 0; count < this.num_nodes; count++){
      /* Get the node with the smallest distance from the start */
      let u = this.minDistance(dist, sptSet);

      if(u === -1)
        break;

      sptSet[u] = true;

      /* Update the distance from this node to all other nodes */
      for(let v = 0; v < this.num_nodes; v++){
        if(!sptSet[v] && this.adj[u][v] !== 0 && dist[u] !== 1000000 && dist[u] + this.adj[u][v] < dist[v]){
          dist[v] = dist[u] + this.adj[u][v];
          parents[v] = u;
          visited.push(v);
        }
      }
    }

    /* Return the output */
    var path = this.getPath(this.end_node, parents, []);
    return [visited, path];
  }

  minDistance(dist, sptSet){
    var min = 1000000;
    var min_index = -1;

    var cord = this.getCord(this.end_node);
    var end_x = cord[1];
    var end_y = cord[0];

    for(var x = 0; x < this.row_size; x++){
      for(var y = 0; y < this.row_size; y++){
        var v = this.getArrayIndex(x, y);
        /*var node_dist = dist[v] + (Math.sqrt(Math.pow(x - end_x, 2) + Math.pow(y - end_y, 2)));*/
        /* Use manhattan distance as can only move in 4 directions not 8 */
        var node_dist = dist[v] + (Math.abs(x - end_x) + Math.abs(y - end_y));

        if(sptSet[v] === false && node_dist <= min){
          min = node_dist;
          min_index = v;
        }
      }
    }
    console.log(min + "," + min_index)

    return min_index;
  }

  getPath(current_node, parents, curren_path){
      let new_node = parents[current_node];
      if(new_node !== -1){
        curren_path.push(new_node);
        return this.getPath(new_node, parents, curren_path);
      }else{
        return curren_path;
      }
  }
}

export default AStar;
