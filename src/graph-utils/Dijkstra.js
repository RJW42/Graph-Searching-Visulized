import Graph from './Graph.js';

class Dijkstra extends Graph{
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

    for(var v = 0; v < this.num_nodes; v++){
      if(sptSet[v] === false && dist[v] <= min){
        min = dist[v];
        min_index = v;
      }
    }

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

export default Dijkstra;
